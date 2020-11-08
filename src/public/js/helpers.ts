export const getLineNumbers = (content: string) => {
    let lineNumString = '';
    const count = content.split(/\r\n|\r|\n/).length

    for (let i = 0; i < count; i++) {
        lineNumString += `${(i + 1)}<br>`
    }

    return lineNumString
}

export const formatHTML = (content: string) => {
    return content
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
        .replace(/\t/g, '&emsp;')
        .replace(/ {4}/g, '&emsp;')
}
