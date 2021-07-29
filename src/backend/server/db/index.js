const mongoose = require('mongoose');
// const multer = require('multer');
// const Grid = require('gridfs-stream');
// const { GridFsStorage } = require('multer-gridfs-storage');

const projectName = 'PROJECT_A';

mongoose
    .connect(`mongodb://127.0.0.1:27017/${projectName}`, {
        useNewUrlParser: true,
    })
    .catch((e) => {
        console.error('Connection error', e.message);
    });

const db = mongoose.connection;

// File storage backend

// let gfs = Grid(db, mongoose.mongo);
// db.open(() => {
//     gfs = Grid(db, mongoose.mongo);
// });

// var gfs;
// db.once('open', () => {
//     console.log('open');
//     gfs = Grid(db.db, mongoose.mongo);
// });

// const storage = new GridFsStorage({
//     db: db,
//     file: (req, file) => {
//         return {
//             filename: file.originalname,
//         };
//     },
// });
// const singleUpload = multer({ storage: storage }).single('file');

module.exports = db;

// db,
// gfs,
// singleUpload,
// };
