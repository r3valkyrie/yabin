import * as express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {AES, enc} from 'crypto-ts';
import sha1 from 'sha1';
import {mdb_put, mdb_find} from '../db';

dotenv.config()

let url: string = process.env.APP_URL
if (url.slice(-1) !== '/') {
    url = url.concat('/')
}

interface YabinPaste {
    content: string,
    lang: string | null | undefined,
    date: number,
    expire: number | null | undefined,
}

const getLineNumbers = (content: string) => {
    let lineNumString = '';
    const count = content.split(/\r\n|\r|\n/).length

    for (let i = 0; i < count; i++) {
        lineNumString += `${(i + 1)}<br>`
    }

    return lineNumString
}

const formatHTML = (content: string) => {
    return content
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
        .replace(/\t/g, '&emsp;')
        .replace(/ {4}/g, '&emsp;')


}

export const register = (app: express.Application) => {
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        res.render('index')
    })

    app.post('/new', (req, res) => {
        const hash = sha1(req.body.content).slice(0, 24);
        const data: YabinPaste = {...req.body, date: Date.now()};
        const content = data.content;
        let encryptedData: YabinPaste = {...data}
        encryptedData.content = AES.encrypt(JSON.stringify({content}), hash).toString()

        mdb_put(encryptedData)
            .then((p: { insertedId: string }) => {
                console.log(`Generated URL: ${url}${p.insertedId}/${hash}`)
                res.send(`${url}${p.insertedId}/${hash}`)
            })
            .catch(console.dir)


    })

    app.get('*', (req, res) => {
        const stripped = req.path.replace('/', '');
        const id: string = stripped.slice(0, 24)
        const key: string = stripped.slice(25, 49)
        if (id.length !== 24) {
            res.render('viewpaste', {
                lines: 1,
                content: "This paste cannot be found."
            })
        } else {
            mdb_find(id)
                .then((paste: YabinPaste) => {
                    try {
                        const decryptedContent = AES.decrypt(paste.content.toString(), key).toString(enc.Utf8)
                        if (decryptedContent) {
                            // You have to do this cursed JSON parsing for it to work properly...
                            const decryptedContentParsed = JSON.parse(decryptedContent).content
                            const lines = getLineNumbers(decryptedContentParsed)
                            const content = formatHTML(decryptedContentParsed)
                            res.render('viewpaste', {lines, content})
                        }
                    }
                    catch {
                        res.render('viewpaste', {
                            lines: 1,
                            content: paste.content
                        })
                    }
                })
        }

    })
}