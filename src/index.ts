import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import * as routes from './routes'

dotenv.config()

const app = express();
const port = process.env.SERVER_PORT;

// Use EJS.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, '../dist/public')));

// Register our routes.
routes.register(app)

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});