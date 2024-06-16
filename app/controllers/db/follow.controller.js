const {mysqlDb} = require('../../models');
const Follow = mysqlDb.follows;

const addFollower = async (req, res) => {
    const followedUsername =  req.params.followedUsername;
    try {
        await Follow.create({
            followed: followedUsername,
            follower: req.body.username,
        });
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

const removeFollower = async (req, res) => {
    try {
        const followedUsername =  req.params.followedUsername;
        const num = await User.destroy({
            where: {
                followed: followedUsername,
                follower: req.body.username,
            }
        });
        if (num !== 1) {
            return res.send({
                message: 'Cannot delete followed-follower relationship.'
            });
        } else {
            return res.send({
                message: 'Followed-follower relationship deleted successfully.'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
};

module.exports = {
    addFollower,
    removeFollower,
}