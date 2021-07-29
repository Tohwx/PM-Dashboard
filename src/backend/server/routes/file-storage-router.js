const express = require('express');
const router = express.Router();
const fileStorageCtrl = require('../controllers/file-storage-ctrl');
// const { singleUpload } = require('../');

router.get('/approvals', fileStorageCtrl.getApprovals);
router.get('/approvals/:id/:download', fileStorageCtrl.getApprovalById);
router.get(
    '/approvals/name/:filename/:download',
    fileStorageCtrl.getApprovalByName
);
router.post(
    '/approvals',
    fileStorageCtrl.singleUpload,
    fileStorageCtrl.uploadFile
);
router.delete('/approvals/:id', fileStorageCtrl.deleteFileById);

module.exports = router;
