
module.exports = (sequelize, Sequelize, DataTypes, User) => {
    const Follow = sequelize.define('follow', {
        followed: {
          type: DataTypes.STRING,
          references: {
            model: User,
            key: User.primaryKeyAttribute,
          },
          validate: {
            notEqualFollower(value) {
                if (value === this.follower) {
                    throw new Error('Followed and follower must be different');
                }
            }
          }
        },
        follower: {
          type: DataTypes.STRING,
          references: {
            model: User,
            key: User.primaryKeyAttribute,
          },
          validate: {
            notEqualFollowed(value) {
                if (value === this.followed) {
                    throw new Error('Followed and follower must be different');
                }
            }
          }
        }
    });
    return Follow;
};