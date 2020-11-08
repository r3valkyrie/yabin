import * as express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {getLineNumbers, formatHTML} from "../public/js/helpers";
import {mdb_put, mdb_find} from '../db';

dotenv.config()

let url: string = process.env.APP_URL
if (url.slice(-1) !== '/') {
    url = url.concat('/')
}

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


export const register = (app: express.Application) => {
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        res.render('index')
    })

    app.post('/new', (req, res) => {
        const data: YabinPaste = {...req.body};

        mdb_put(data)
            .then((p: { insertedId: string }) => {
                console.log(`Generated URL: ${url}${p.insertedId}`)
                res.send(`${url}${p.insertedId}`)
            })
            .catch(console.dir)


    })

    app.get('*', (req, res) => {
        const id = req.path.replace('/', '');
        if (id.length !== 24) {
            res.render('viewpaste', {
                paste: "This paste cannot be found.",
                lines: 1,
                encrypted: false,
            })
        } else {
            mdb_find(id)
                .then((yabinpaste: YabinPaste) => {
                    if (yabinpaste.encrypted){
                        res.render('viewpaste', {
                            lines: 1,
                            paste: yabinpaste.content,
                            encrypted: yabinpaste.encrypted,
                        })
                    } else {
                        const content: YabinPasteContent = JSON.parse(yabinpaste.content)
                        const lines: string = getLineNumbers(content.paste)

                        res.render('viewpaste', {
                            lines,
                            paste: content.paste,
                            encrypted: yabinpaste.encrypted,
                        })
                    }
                })
        }

    })
}