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

    const saveBtn = document.getElementById('save') as HTMLElement;
    const url = document.getElementById('paste-url') as HTMLInputElement;
    const copyURLBtn = document.getElementById('copyURLButton') as HTMLButtonElement;

    url.value = ''

    saveBtn.addEventListener('click', function() {
        saveBtn.classList.add('disabled')
        axios.post(
            '/new',
            {
                content: editor.getValue(),
                lang: null,
                expire: null,
            }
        )
            .then(res => {
                url.value = res.data;
                saveBtn.classList.remove('disabled')
                copyURLBtn.classList.remove('disabled')
            })
            .catch(e => {console.log(e)})

    })


    copyURLBtn.addEventListener('click', function() {
        url.select();
        url.setSelectionRange(0, 99999);
        document.execCommand('copy');
    })
});

