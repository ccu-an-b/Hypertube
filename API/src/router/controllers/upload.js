const   express = require('express'),
        router  = express.Router(),
        multer  = require('multer');

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif'  )
        return cb(null, true);
    return cb(new Error('Only JPEG/JPG/GIF/PNG is allowed!'), false);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname+'../../../public/img/')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now()+ '.'+ext);
    }
});

const upload = multer({storage: storage, fileFilter: fileFilter});
const singleUpload = upload.single('img');

router.route('/upload')
    .post((req, res) => { //Upload picture to /public/img
        singleUpload(req, res, (err) => {
            if ( err ){
                return res.status(200).send({
                    status:false,
                    code: 'UPLOADERROR',
                    result: err.message
                });
            }
            return res.json({'imageUrl': req.file.filename});
        });
    })

module.exports = router;