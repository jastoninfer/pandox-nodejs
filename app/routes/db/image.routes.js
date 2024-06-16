
const { Image } = require('../../controllers/db');
const { imageHelper } = require('../../middleware/utility');
const { verifyLoggedIn, verifyAuthorization } = require('../../middleware/access');

module.exports = app => {
    var router = require('express').Router();
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });
    // 上传图片
    router.post('/images', [
        verifyLoggedIn.isTokenValid,
        // imageHelper.uploadImage.single('image'),
        (req, res, next) => {
            // console.log('body is ', req.body);
            imageHelper.uploadImage(req.body.username).single('image')(req, res, (err) => {
                if (err) {
                    console.error('Error during file upload: ', err);
                    return res.status(500).json({error: err.message});
                }
                next();
            });
        }
    ], Image.addImage);
    router.get('/imagelist/:username', [verifyLoggedIn.isTokenValid], Image.getAllImages);
    // 只要能拿到id, 就可以GET对应的图片, 图片的查看不检查任何权限
    // 实际上图片的id就是修饰过的图片名
    router.get('/images/:username/:imageId', Image.getImageById);
    router.delete('/images/:username/:imageId', [
        verifyLoggedIn.isTokenValid,
        verifyAuthorization.checkImageOwner
    ], Image.deleteImageById);
    // router.get('/:filename', Image.getImageByName);
    // router.get('/:id', Image.getImageById);
    app.use('/api/db', router);
};