const multer = require("multer");
const fs = require('fs').promises;
const path = require('path');
// import { rootPath } from "../../config/resource.config";
const { rootPath } = require('../../config/resource.config');
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const createStorage = (username) => {
    return multer.diskStorage({
        destination: async (req, file, cb) => {
            const dir = path.join(rootPath, `img_data/${username}`);
            try {
                await fs.access(dir);
            } catch (err) {
                console.log("Directory doesn't exist.");
                return cb(err);
            }
            try {
                await fs.access(path.join(dir, file.originalname));
                console.log('Filename already exists.');
                return cb('Internal error: filename exists');
            } catch (err) {
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    })
};

var storage1 = multer.diskStorage({
    destination: async (req, file, cb) => {
        const dir = path.join(rootPath, `img_data/${req.body.username}`);
        try {
            await fs.access(dir);
        } catch (err) {
            console.log("Directory doesn't exist.");
            return cb(err);
        }
        try {
            await fs.access(path.join(dir, file.originalname));
            console.log('Filename already exists.');
            return cb('Internal error: filename exists');
        } catch (err) {
            
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
        // cb(null, `${Date.now()}-pandox-${file.originalname}`);
    },
});

const uploadImage = (username) => {
    // const storage = createStorage(username);
    // const fileFilter = imageFilter;
    return multer({storage: createStorage(username), fileFilter: imageFilter});
}

// var uploadImage123 = multer({ storage, fileFilter: imageFilter});
module.exports = { uploadImage };