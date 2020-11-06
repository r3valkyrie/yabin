import * as M from "materialize-css";
import CodeMirror from 'codemirror';
import axios from 'axios';
import 'codemirror/addon/selection/active-line';


M.AutoInit();


document.addEventListener('DOMContentLoaded', function () {
    // Initialize and configure text editor.
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor') as HTMLTextAreaElement, {
            lineNumbers: true,
            theme: 'nord',
            lineWrapping: true,
            scrollbarStyle: 'null',
            autofocus: true,
            styleActiveLine: true,
        }
    )

    // Initialize sidebar.
    const ele = document.querySelectorAll<HTMLInputElement>('.sidenav');
    const inst: any = M.Sidenav.init(ele, {
        edge: 'right',
    });

    const closeButton = document.getElementById('closesidemenu') as HTMLElement;

    closeButton.addEventListener('click', function () {
        inst[0].close();
    })

    // Override default key combination behavior.
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            inst[0].isOpen ? inst[0].close() : inst[0].open();
        }

        if (event.key === 'Escape' && inst[0].isOpen) {
            event.preventDefault();
            inst[0].close();
        }
    });

    // Saving a paste.
    interface YabinPaste {
        content: string                     // The content of the paste
        date: number                        // The timestamp (Date.now())
        lang: string | null | undefined     // The programming language (will guess if null)
    }

    const saveBtn = document.getElementById('save') as HTMLElement;

    saveBtn.addEventListener('click', function() {
        axios.post(
            '/new',
            <YabinPaste>{
                content: editor.getValue(),
                date: Date.now(),
                lang: null
            }
        )
            .then(res => {
                console.log(res)
            })
            .catch(e => {console.log(e)})

    })
});

