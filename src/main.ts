import * as vscode from 'vscode';

const superLog = () => {
    console.log('executed');
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    // Get user selection
    const selection = editor.selection;

    const startLine = selection.start.line;
    const endLine = selection.end.line;

    const getVariable = /(const|let|var)\s+(\w+)\s*=/;


   
    editor.edit(editBuilder => {

        for (let i = startLine; i <= endLine; i++) {
            const line = editor.document.lineAt(i);
            const selectionText = line.text;
            const m = selectionText.match(getVariable);;
            let text = ""
            if(selectionText.lastIndexOf(";")===-1){
                text += ";";
            }
            console.log(m);
            if (!m) {
                continue;
            }
            const variable = m[2];
    
            // Insert text above current line
            const selectionLine = line;
            const insertPosition = selectionLine.range.end;
            text += `   console.log( 'Line ${i+1} ----- ${variable}', ${variable})`;
            // text += `\r`;
    
            const whitespace = selectionLine.firstNonWhitespaceCharacterIndex;
            const spaces = selectionLine.text.length - selectionLine.text.replace(/^\s+/, '').length;
            console.log('tabspace', spaces, 'a', selectionLine.text.replace(/^\s+/gm, ''));
            // text = ' '.repeat(spaces) + text.replace(/\r/g, `\r${' '.repeat(spaces)} `);
            //text = `${padSpaceStr}${text}`;
            // text = text.slice(0, text.length - whitespace - 1);
    
            // Insert the text :)
            editBuilder.insert(insertPosition, text);
            console.log( "running", i);
    }
    });
};
export default superLog;