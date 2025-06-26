// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface AutoConfirmConfig {
	enabled: boolean;
	confirmationDelay: number;
	showNotifications: boolean;
	keywords: string[];
}

class AutoConfirmManager {
	private originalShowInformationMessage: typeof vscode.window.showInformationMessage;
	private originalShowWarningMessage: typeof vscode.window.showWarningMessage;
	private originalShowErrorMessage: typeof vscode.window.showErrorMessage;
	private isEnabled = false;
	private statusBarItem: vscode.StatusBarItem;

	constructor(private context: vscode.ExtensionContext) {
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		this.statusBarItem.command = 'auto-confirm-copilot.toggle';
		this.context.subscriptions.push(this.statusBarItem);

		// Store original methods
		this.originalShowInformationMessage = vscode.window.showInformationMessage;
		this.originalShowWarningMessage = vscode.window.showWarningMessage;
		this.originalShowErrorMessage = vscode.window.showErrorMessage;

		this.loadConfiguration();
		this.updateStatusBar();
		this.statusBarItem.show();
	}

	private getConfig(): AutoConfirmConfig {
		const config = vscode.workspace.getConfiguration('autoConfirmCopilot');
		return {
			enabled: config.get('enabled', false),
			confirmationDelay: config.get('confirmationDelay', 500),
			showNotifications: config.get('showNotifications', true),
			keywords: config.get('keywords', ['Copilot', 'GitHub Copilot', 'script', 'continue', 'proceed'])
		};
	}

	private shouldAutoConfirm(message: string): boolean {
		const config = this.getConfig();
		if (!config.enabled) {
			return false;
		}

		const lowerMessage = message.toLowerCase();
		return config.keywords.some(keyword => 
			lowerMessage.includes(keyword.toLowerCase())
		);
	}

	private async autoConfirmWithDelay<T>(
		originalMethod: Function,
		message: string,
		items: T[],
		defaultItem?: T
	): Promise<T | undefined> {
		const config = this.getConfig();
		
		if (this.shouldAutoConfirm(message)) {
			if (config.showNotifications) {
				this.showAutoConfirmNotification(message);
			}

			// Add delay for safety
			await new Promise(resolve => setTimeout(resolve, config.confirmationDelay));
			
			// Return the first "positive" item (Continue, Yes, OK, etc.) or the first item
			const positiveItems = items.filter((item: any) => {
				if (typeof item === 'string') {
					return /^(continue|yes|ok|proceed|confirm|allow)$/i.test(item);
				}
				if (item && typeof item === 'object' && 'title' in item) {
					return /^(continue|yes|ok|proceed|confirm|allow)$/i.test((item as any).title);
				}
				return false;
			});
			
			return positiveItems.length > 0 ? positiveItems[0] : (defaultItem || items[0]);
		}

		// Call original method if not auto-confirming
		return originalMethod.call(vscode.window, message, ...items);
	}

	private showAutoConfirmNotification(originalMessage: string) {
		const shortMessage = originalMessage.length > 50 
			? originalMessage.substring(0, 50) + '...' 
			: originalMessage;
		
		// Use original method to avoid recursion
		this.originalShowInformationMessage(`🤖 Auto-confirmed: ${shortMessage}`);
	}

	public enable() {
		if (this.isEnabled) {
			return;
		}

		this.isEnabled = true;

		// Override window methods
		(vscode.window as any).showInformationMessage = async (message: string, ...items: any[]) => {
			return this.autoConfirmWithDelay(this.originalShowInformationMessage, message, items);
		};

		(vscode.window as any).showWarningMessage = async (message: string, ...items: any[]) => {
			return this.autoConfirmWithDelay(this.originalShowWarningMessage, message, items);
		};

		// Don't auto-confirm error messages for safety
		(vscode.window as any).showErrorMessage = this.originalShowErrorMessage;

		this.updateStatusBar();
		
		if (this.getConfig().showNotifications) {
			this.originalShowInformationMessage('🤖 Auto Confirm Copilot: Enabled');
		}
	}

	public disable() {
		if (!this.isEnabled) {
			return;
		}

		this.isEnabled = false;

		// Restore original methods
		(vscode.window as any).showInformationMessage = this.originalShowInformationMessage;
		(vscode.window as any).showWarningMessage = this.originalShowWarningMessage;
		(vscode.window as any).showErrorMessage = this.originalShowErrorMessage;

		this.updateStatusBar();
		
		if (this.getConfig().showNotifications) {
			this.originalShowInformationMessage('🤖 Auto Confirm Copilot: Disabled');
		}
	}

	public toggle() {
		if (this.isEnabled) {
			this.disable();
		} else {
			this.enable();
		}
	}

	private updateStatusBar() {
		const config = this.getConfig();
		if (this.isEnabled && config.enabled) {
			this.statusBarItem.text = '🤖✅ Auto Confirm';
			this.statusBarItem.tooltip = 'Auto Confirm Copilot: Enabled (Click to toggle)';
			this.statusBarItem.backgroundColor = undefined;
		} else {
			this.statusBarItem.text = '🤖❌ Auto Confirm';
			this.statusBarItem.tooltip = 'Auto Confirm Copilot: Disabled (Click to toggle)';
			this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
		}
	}

	private loadConfiguration() {
		const config = this.getConfig();
		if (config.enabled) {
			this.enable();
		} else {
			this.disable();
		}
	}

	public onConfigurationChanged() {
		this.loadConfiguration();
		this.updateStatusBar();
	}

	public dispose() {
		this.disable();
		this.statusBarItem.dispose();
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Auto Confirm Copilot extension is now active!');

	const autoConfirmManager = new AutoConfirmManager(context);

	// Register commands
	const toggleCommand = vscode.commands.registerCommand('auto-confirm-copilot.toggle', () => {
		autoConfirmManager.toggle();
	});

	const enableCommand = vscode.commands.registerCommand('auto-confirm-copilot.enable', () => {
		autoConfirmManager.enable();
	});

	const disableCommand = vscode.commands.registerCommand('auto-confirm-copilot.disable', () => {
		autoConfirmManager.disable();
	});

	// Listen for configuration changes
	const configWatcher = vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('autoConfirmCopilot')) {
			autoConfirmManager.onConfigurationChanged();
		}
	});

	// Add to subscriptions
	context.subscriptions.push(
		toggleCommand,
		enableCommand,
		disableCommand,
		configWatcher,
		autoConfirmManager
	);

	// Show welcome message
	vscode.window.showInformationMessage(
		'🤖 Auto Confirm Copilot extension loaded! Use the status bar button to toggle.',
		'Open Settings'
	).then(selection => {
		if (selection === 'Open Settings') {
			vscode.commands.executeCommand('workbench.action.openSettings', 'autoConfirmCopilot');
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Auto Confirm Copilot extension deactivated');
}
