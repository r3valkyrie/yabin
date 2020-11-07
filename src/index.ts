import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import * as routes from './routes'

dotenv.config()

const app = express();
const port = parseInt(process.env.SERVER_PORT);

// Use EJS.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, '../dist/public')));

// Register our routes.
routes.register(app)

app.listen(port, '0.0.0.0', () => {
    console.log(`Yabin instance started on port ${port}`)
});