import * as express from 'express';
import bodyParser from 'body-parser';
import sha1 from 'sha1';

export const register = (app: express.Application) => {
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.get('/', (req: any, res) => {
        res.render('index')
    })

    app.post('/new', (req: any, res) => {
        res.send(sha1(req.body.content))
    })
}