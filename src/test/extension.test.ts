import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Auto Confirm Copilot Test Suite', () => {
	vscode.window.showInformationMessage('Start Auto Confirm Copilot tests.');

	test('Extension should be present', async () => {
		const extension = vscode.extensions.getExtension('undefined_publisher.auto-confirm-copilot');
		assert.ok(extension);
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('undefined_publisher.auto-confirm-copilot');
		if (extension) {
			await extension.activate();
			assert.ok(extension.isActive);
		}
	});

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('auto-confirm-copilot.toggle'));
		assert.ok(commands.includes('auto-confirm-copilot.enable'));
		assert.ok(commands.includes('auto-confirm-copilot.disable'));
	});
});
