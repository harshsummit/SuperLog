import * as vscode from 'vscode';

export const superLog = () => {
    console.log('executed');
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    // Get user selection
    const selection = editor.selection;

    const startLine = selection.start.line;
    const endLine = selection.end.line;

    const regex1 = /(const|let|var)\s+(\w+)\s*=/;
    const regex2 = /(?:^|\.)\s*([a-zA-Z_]\w*)\s*=/;



   
    editor.edit(editBuilder => {

        for (let i = startLine; i <= endLine; i++) {
            const line = editor.document.lineAt(i);
            const selectionText = line.text;
            if (selectionText.trim().endsWith('{') || selectionText.trim().endsWith(',')){
                continue;
            }
            const m = selectionText.match(regex1);;
            const n = selectionText.match(regex2);;

            let text = "";
            if(selectionText.lastIndexOf(";")===-1){
                text += ";";
            }
            console.log('m---',m);
            console.log('n---',n);
            // if (!m && !n) {
            //     continue;
            // }
            const variable =  m ? m[2] : n ? `this.${n[1]}` : null;
    
            if(!variable) {
                continue;
            };
            // Insert text above current line
            const selectionLine = line;
            const insertPosition = selectionLine.range.end;
            text += `   console.log( 'Line ${i+1} ----- ${variable}', ${variable}) //superlog`;
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
export const superRemove = () =>{
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    // Get user selection
    const selection = editor.selection;

    const startLine = selection.start.line;
    const endLine = selection.end.line;

    const getConsoles = /\s*console\.log\([\s\S]*\/\/superlog/g;


   
    editor.edit(editBuilder => {

        for (let i = startLine; i <= endLine; i++) {
            
            const selectionText = editor.document.lineAt(i).text;
            const m = selectionText.match(getConsoles);;
            console.log(m);
            if (!m) {
                continue;
            }
            const variable = m[2];
            
            const lineStart = new vscode.Position(i, 0);
            const lineEnd = new vscode.Position(i, editor.document.lineAt(i).text.length);
            const lineRange = new vscode.Range(lineStart, lineEnd);
            const newText = selectionText.replace(getConsoles,'');
            editBuilder.replace(lineRange, newText);
    }
    });
};