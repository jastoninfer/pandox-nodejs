const { mysqlDb } = require('../../models');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const Image = mysqlDb.images;

// 需要注意的是, 一个image必然属于某个page, 不能脱离某个page而单独存在
// 
/*
  POST      /images                 上传新的image到数据库
  GET       /images/:id             根据image id检索某个image
  DELETE    /images/:id             根据image id删除某个image
*/

exports.addImage = (req, res) => {

    // Image.create({
    //     type: req.file.mimetype,
    //     name: req.file.originalname,
    //     data: fs.readFileSync(
    //         __basedir + "/resources/static/assets/uploads/" + req.file.filename
    //     ),
    // }).then(image => {
    //     fs.writeFileSync(
    //         __basedir + "/resources/static/assets/tmp/" + image.name,
    //         image.data
    //     );
    //     res.send(`image uploaded successfully`);
    // }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || 'Some error occurred while uploading the image.'
    //     });
    // });
    console.log('method called anyway.....');
    if(req.file) {
        console.log('file name is ',req.file.filename);
        res.json({filename: req.file.filename});
    } else {
        res.status(400).json({error: 'No file uploaded.'});
    }
};

exports.getImageById = async (req, res) => {
    const imageId = req.params.imageId;
    const username = req.params.username;
    try {
        const imagePath = path.join(`/Users/jeylnastoninfer/Desktop/prac/nodejs_myapp/img_data/${username}`, imageId);
        fs.accessSync(imagePath, fs.constants.R_OK);
        const imageStream = fs.createReadStream(imagePath);
        const mimeType = mime.lookup(imagePath);
        res.set('Content-Type', mimeType);
        imageStream.pipe(res);
    } catch (err) {
        console.log(err);
        console.log('Error fetching image!');
        res.status(500).send('Internal Server Error.');
    }
};

exports.getImageById123 = async (req, res) => {
    // 这里imageId其实就是image的随机名.后缀名
    // 数据库查表主要是验证图片的所有者信息
    // 对于getImageById来说, 实际可以不用过数据库
    const imageId = req.params.imageId;
    const username = req.params.username;
    // console.log('here....');
    try {
        // console.log('imageiD', imageId);
        const imageEntry = await Image.findByPk(imageId);
        // Image表的功能类似于中间价或者缓存, 指示图片是否存在, 以及图片的类型
        // Image表中username和imageName联合作为主键
        // usernmae同时是外键
        // 在现在的实现中, 我们假设用户名username不能被修改
        // console.log('imageiD', imageId);
        if(!imageEntry) {
            return res.status(404).send('Image not found');
        }
        // console.log('HERE....');
        const imageType = imageEntry.type;
        const imagePath = path.join(`/Users/jeylnastoninfer/Desktop/prac/nodejs_myapp/img_data/${username}`, imageId);
        console.log('Path', imagePath);
        fs.accessSync(imagePath, fs.constants.R_OK);
        // console.log('exiss?', imageExists);
        // if (!imageExists) {
        //     return res.status(404).send('Image not found');
        // }
        const imageStream = fs.createReadStream(imagePath);
        res.set('Content-Type', imageType);
        imageStream.pipe(res);
    } catch(err) {
        console.log(err);
        console.log('Error fetching image!');
        res.status(500).send('Internal Server Error.');
    }
    // Image.findByPk(imageId).then(img => {
    //         if(img) {
    //             res.send(img.data);
    //         } else{
    //             res.status(404).send({
    //                 message: `Image doesn't exist.`
    //             });
    //         }
    //     }).catch(err => {
    //         res.status(500).send({
    //             message : err.message || 'Error while retrieving the image.'
    //         })
    //     });

}

// 查询某个用户下所有的images
exports.getAllImages = (req, res) => {
    const username = req.body.username;
    const imageIdx = parseInt(req.query.imageIdx) || 1;
    // 有分页， 但未实现
    Image.findAll({
        where: {
            author: username,
        }
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message : err.message || 'Error while retrieving the images.'
        });
    });
};

// 尝试根据id删除某个image
exports.deleteImageById = (req, res) => {
    // 可以使用类似GC的后台进程自动删除图片而不是
    // 给前端提供一个API显式删除某些图片
    const imageId = req.params.imageId;
    Image.destroy({
        where: {name: imageId}
    }).then(num => {
        if(num == 1){
            res.send({
                message: 'Image deleted successfully',
            });
        }else{
            res.send({
                message: 'Cannot delete image. Maybe not found.'
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: 'Internal error when trying to delete image.'
        });
    })
};