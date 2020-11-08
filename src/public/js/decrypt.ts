import {AES, enc} from 'crypto-js';
import * as M from 'materialize-css';
import {getLineNumbers, formatHTML} from "./helpers";

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

// Decrypt the message if it needs to be decrypted.
const decryptContent = (paste: string, key: string) => {
    const bytes = AES.decrypt(paste, key);
    return JSON.parse(bytes.toString(enc.Utf8));
}

const updateContent = (content: YabinPasteContent) => {
    let contentArea = document.getElementById('yabin-content') as HTMLElement;
    contentArea.innerHTML = formatHTML(content.paste)

    let lineNum = document.getElementById('yabin-linenum') as HTMLElement;
    lineNum.innerHTML = getLineNumbers(content.paste)

}

document.addEventListener('DOMContentLoaded', () => {

    //@ts-ignore
    if (encrypted){
        // Initialize the modal
        const modals = document.querySelectorAll<HTMLElement>('.modal');
        const decryptModal = document.getElementById('decrypt-modal') as HTMLElement;
        const modalInstances = M.Modal.init(modals, {
            dismissible: false,
            startingTop: '25%',
        })
        const inst = M.Modal.getInstance(decryptModal)


        // Open the modal instance if the message is encrypted.
        inst.open()

        // Submit decryption key and decrypt the message.
        const decryptButton = document.getElementById('enterDecryptionKey') as HTMLElement;
        const decryptForm = document.getElementById('decryption-key') as HTMLInputElement;


        decryptButton.addEventListener('click', () => {
            //@ts-ignore
            const decryptedContent: YabinPasteContent = decryptContent(paste, decryptForm.value)

            if (decryptedContent) {
                updateContent(decryptedContent)
                inst.close()
            }
        })
    }


})