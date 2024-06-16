const {mysqlDb} = require('../../models');
const Like = mysqlDb.likes;


const savePage = async (req, res) => {
    const pageId = req.params.pageId;
    try {
        await Like.create({
            username: req.body.username,
            pageId: pageId,
        });
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

const removeSavedPage = async (req, res) => {
    try {
        const pageId = req.params.pageId;
        const num = await Like.destroy({
            where: {
                username: req.body.username,
                pageId: pageId,
            }
        });
        if (num !== 1) {
            return res.send({
                message: 'Cannot delete saved page.'
            });
        } else {
            return res.send({
                message: 'Saved page deleted successfully.'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

module.exports = {
    savePage,
    removeSavedPage,
}