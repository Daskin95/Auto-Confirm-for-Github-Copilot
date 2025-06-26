# Auto Confirm Copilot

Un'estensione di Visual Studio Code che automatizza le conferme per le iterazioni di GitHub Copilot, eliminando la necessità di confermare manualmente i dialoghi di esecuzione script e altre operazioni.

## 🚀 Funzionalità

- **Conferma Automatica**: Approva automaticamente i dialoghi di conferma di GitHub Copilot
- **Controllo Intelligente**: Riconosce i messaggi di Copilot tramite parole chiave configurabili
- **Sicurezza**: Delay configurabile prima della conferma automatica per maggiore sicurezza
- **Interfaccia Intuitiva**: Pulsante nella barra di stato per attivare/disattivare rapidamente
- **Configurabile**: Impostazioni complete per personalizzare il comportamento
- **Notifiche**: Mostra notifiche quando vengono confermate automaticamente le operazioni

## 📋 Requisiti

- Visual Studio Code versione 1.101.0 o superiore
- GitHub Copilot estensione (raccomandato per testare la funzionalità)

## ⚙️ Impostazioni

Questa estensione contribuisce alle seguenti impostazioni:

- `autoConfirmCopilot.enabled`: Abilita/disabilita la conferma automatica (default: `false`)
- `autoConfirmCopilot.confirmationDelay`: Ritardo in millisecondi prima della conferma automatica (default: `500`)
- `autoConfirmCopilot.showNotifications`: Mostra notifiche quando vengono confermate operazioni (default: `true`)
- `autoConfirmCopilot.keywords`: Array di parole chiave da cercare nei messaggi (default: `["Copilot", "GitHub Copilot", "script", "continue", "proceed"]`)

## 🎯 Utilizzo

1. **Attivazione**: Clicca sul pulsante "🤖❌ Auto Confirm" nella barra di stato per attivare l'estensione
2. **Configurazione**: Vai nelle impostazioni VS Code e cerca "Auto Confirm Copilot" per personalizzare il comportamento
3. **Monitoraggio**: Quando attiva, l'estensione mostrerà "🤖✅ Auto Confirm" nella barra di stato

### Comandi Disponibili

- `Auto Confirm Copilot: Toggle Auto Confirm` - Attiva/disattiva la funzionalità
- `Auto Confirm Copilot: Enable Auto Confirm` - Abilita la conferma automatica
- `Auto Confirm Copilot: Disable Auto Confirm` - Disabilita la conferma automatica

## 🛡️ Sicurezza

L'estensione include diverse misure di sicurezza:

- **Non conferma mai messaggi di errore** per evitare di nascondere problemi importanti
- **Delay configurabile** prima della conferma automatica
- **Filtro per parole chiave** per confermare solo dialoghi rilevanti
- **Controllo utente completo** con possibilità di attivare/disattivare facilmente

## 🚨 Problemi Noti

- L'estensione modifica temporaneamente i metodi nativi di VS Code per intercettare i dialoghi
- Potrebbe non funzionare con estensioni che modificano anch'esse i metodi di notifica
- È una versione iniziale e potrebbe richiedere aggiustamenti per specifici tipi di dialoghi

## 📝 Note di Rilascio

### 0.0.1

- Rilascio iniziale dell'estensione Auto Confirm Copilot
- Supporto per conferma automatica dei dialoghi di informazione e avviso
- Configurazione completa tramite impostazioni VS Code
- Interfaccia utente con pulsante nella barra di stato
- Misure di sicurezza integrate

## 🔧 Sviluppo

Per sviluppare o modificare questa estensione:

1. Clona o scarica il progetto
2. Apri in VS Code
3. Esegui `npm install` per installare le dipendenze
4. Premi `F5` per avviare una nuova finestra di VS Code con l'estensione caricata
5. Testa la funzionalità creando dialoghi di test

## 📄 Linee Guida

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
