const vscode = require('vscode')

function colonize (option) {
  var editor = vscode.window.activeTextEditor
  if (!editor) return

  vscode.commands.executeCommand('acceptSelectedSuggestion').then(() => {
    var lineIndex = editor.selection.active.line
    var lineObject = editor.document.lineAt(lineIndex)

    if (lineObject.text.charAt(45) !== ';') {
      var insertionSuccess = editor.edit((editBuilder) => {
		for (let i = lineObject.text.length; i < 45; i++) 
			editBuilder.insert(new vscode.Position(lineIndex, 45), ' ')
		editBuilder.insert(new vscode.Position(lineIndex, 45), ';')
      })

      if (!insertionSuccess) return
    }

    if (option === 'hold') return

    option === 'endline'
      ? vscode.commands.executeCommand('cursorEnd')
      : vscode.commands.executeCommand('editor.action.insertLineAfter')
  })
}

function activate (context) {
  var endLineDisposable = vscode.commands.registerCommand('colonize.endline', () => {
    colonize('endline')
  })

  var holdDisposable = vscode.commands.registerCommand('colonize.hold', () => {
    colonize('hold')
  })

  var newLineDisposable = vscode.commands.registerCommand('colonize.newline', () => {
    colonize('newline')
  })

  context.subscriptions.push(endLineDisposable)
  context.subscriptions.push(newLineDisposable)
  context.subscriptions.push(holdDisposable)
}

exports.activate = activate
