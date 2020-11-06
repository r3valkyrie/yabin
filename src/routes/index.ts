import * as express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import sha1 from 'sha1';

dotenv.config()

let url:string = process.env.APP_URL
if (url.slice(-1) !== '/'){
    url = url.concat('/')
}

export const register = (app: express.Application) => {

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.get('/', (req: any, res) => {
        res.render('index')
    })

    app.post('/new', (req: any, res) => {
        const key = 'keyhere'
        const hash = sha1(req.body.content).slice(0, 20)
        res.send(`${url}${key}/${hash}`)
    })
}