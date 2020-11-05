const textarea = document.getElementById('textarea1') as HTMLTextAreaElement;

if (!!textarea) {
    textarea.addEventListener('keydown', function (e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            const start: any = this.selectionStart;
            const end: any = this.selectionEnd;

            this.value = this.value.substring(0, start) + '\t' + this.value.substring(end)

            this.selectionStart = this.selectionEnd = start + 1
        }
    })

}

// On clicks need to be created this way.
document.addEventListener("DOMContentLoaded", function () {
    let save = document.getElementById('saveButton') as HTMLElement;
    let clear = document.getElementById('clearButton') as HTMLElement;

    // Save button
    save.addEventListener('click', () => {
        console.log(textarea.value)
    })

    // Clear button
    clear.addEventListener('click', () => {
        if (confirm("Clear this paste?")) {
            textarea.value = ''
        }
    })
})

