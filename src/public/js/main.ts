import * as M from "materialize-css";
import CodeMirror from 'codemirror';
import {AES} from 'crypto-js';
import axios from 'axios';
import 'codemirror/addon/selection/active-line';


M.AutoInit();

interface YabinPasteContent {
    paste: string,
    lang: string | null | undefined,
    date: number,
    expire: number | null | undefined | string,
}

interface YabinPaste {
    content: string
    encrypted: boolean
}

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

    // Encryption key generator
    const keyGenBtn = document.getElementById('generateKey') as HTMLElement;

    // Generates a 15 character random key.
    const keyGen = () => {
        let key = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgijklmnopqrstuvwxyz0123456789@#$'

        for (let i = 1; i < 16; i++){
            const char = Math.floor(Math.random() * chars.length + 1);
            key += chars.charAt(char)
        }

        return key
    }

    // Generate a key on press.
    keyGenBtn.addEventListener('click', () => {
        encryptField.value = keyGen()
    })


    // Add click event to the save button.
    const saveBtn = document.getElementById('save') as HTMLElement;
    const encryptField = document.getElementById('encryptionKey') as HTMLInputElement;
    encryptField.value = ''

    // Returns a boolean to decide whether or not the paste should be encrypted.
    const shouldEncryptContent= () => {
        return !!encryptField.value
    }
    const encryptContent = (content: YabinPasteContent, key: string) => {
        return AES.encrypt(JSON.stringify(content), key).toString();
    }

    saveBtn.addEventListener('click', function() {

        saveBtn.classList.add('disabled')

        const content: YabinPasteContent = {
            paste: editor.getValue(),
            lang: null,
            date: Date.now(),
            expire: null,
        }

        let data: YabinPaste = {
            content: shouldEncryptContent() ?
                encryptContent(content, encryptField.value) :
                JSON.stringify(content),
            encrypted: shouldEncryptContent(),
        }

        // Post our paste to the /new endpoint.
        axios.post( '/new', data )
            .then(res => {
                url.value = res.data;
                saveBtn.classList.remove('disabled')
                copyURLBtn.classList.remove('disabled')
            })
            .catch(e => {console.log(e)})
    })


    // Add click event to the url-copy button.
    const url = document.getElementById('paste-url') as HTMLInputElement;
    const copyURLBtn = document.getElementById('copyURLButton') as HTMLButtonElement;

    url.value = ''
    copyURLBtn.addEventListener('click', function() {
        url.select();
        url.setSelectionRange(0, 99999);
        document.execCommand('copy');
    })
});

