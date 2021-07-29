const mongoose = require('mongoose');
const db = require('../db');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');

// Fix gridfs-stream compatibility issues. See https://github.com/aheckmann/gridfs-stream/issues/125 for other solutions.
eval(
    `Grid.prototype.findOne = ${Grid.prototype.findOne
        .toString()
        .replace('nextObject', 'next')}`
);

var gfs;
db.once('open', () => {
    console.log('open');
    gfs = Grid(db.db, mongoose.mongo);
});

const storage = new GridFsStorage({
    db: db,
    file: (req, file) => {
        return {
            filename: file.originalname,
        };
    },
});
const singleUpload = multer({ storage: storage }).single('file');

const getApprovals = (req, res) => {
    if (!gfs) return res.json({ error: 'Check connection to db' });
    gfs.files
        .find()
        .sort({ uploadDate: -1 })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'Could not find files' });
            }
            return res.json(files);
        });
};

const getApprovalById = (req, res) => {
    if (!gfs) return res.json({ error: 'Check connection to db' });

    gfs.findOne({ _id: req.params.id }, (err, file) => {
        if (err || !file) {
            return res.status(404).json({
                error: err,
                message: 'Could not find file',
            });
        }

        if (parseInt(req.params.download)) {
            var readstream = gfs.createReadStream({
                filename: file.filename,
            });
            res.set('Content-Type', file.contentType);
            res.set(
                'Content-Disposition',
                `attachment; filename=${file.filename}`
            );
            return readstream.pipe(res);
        } else {
            return res.json(file);
        }
    });
};

const getApprovalByName = (req, res) => {
    if (!gfs) return res.json({ error: 'Check connection to db' });

    gfs.files
        .find({ filename: req.params.filename })
        .sort({ uploadDate: -1 })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    error: err,
                    message: 'Could not find file',
                });
            }

            if (parseInt(req.params.download)) {
                var readstream = gfs.createReadStream({
                    filename: files[0].filename,
                });
                res.set('Content-Type', files[0].contentType);
                res.set(
                    'Content-Disposition',
                    `attachment; filename=${files[0].filename}`
                );
                return readstream.pipe(res);
            } else {
                return res.json(files[0]);
            }
        });
};

const uploadFile = (req, res) => {
    if (req.file) {
        return res.json({
            success: true,
            file: req.file,
        });
    }
    res.send({ success: false, message: 'Please provide a file to upload' });
};

const deleteFileById = (req, res) => {
    if (!gfs) return res.json({ error: 'Check connection to db' });

    gfs.remove({ _id: req.params.id }, (err) => {
        if (err) return res.status(500).json({ success: false, message: err });
        return res.json({ success: true });
    });
};

module.exports = {
    singleUpload,
    getApprovals,
    getApprovalById,
    getApprovalByName,
    uploadFile,
    deleteFileById,
};
