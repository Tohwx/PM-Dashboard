const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const componentRouter = require('./routes/component-router');
const fileStorageRouter = require('./routes/file-storage-router');

const app = express();
const apiPort = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', componentRouter);
app.use('/api', fileStorageRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
