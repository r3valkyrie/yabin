import * as express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
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
        const hash = sha1(req.body.content).slice(0, 24)

        const data: YabinPaste = {...req.body, date: Date.now()}

        mdb_put(data)
            .then( (p:{insertedId: string}) => {
                console.log(`Generated URL: ${url}${p.insertedId}/${hash}`)
                res.send(`${url}${p.insertedId}/${hash}`)
            })
            .catch(console.dir)


    })

    app.get('*', (req, res) => {
        const stripped = req.path.replace('/', '');
        const id: string = stripped.slice(0, 24)
        const key: string = stripped.slice (25, 49)


        mdb_find(id)
            .then((paste:YabinPaste) => {
                const lines = getLineNumbers(paste.content)
                const content = formatHTML(paste.content)
                res.render('viewpaste', {lines, content})
            })
    })
}