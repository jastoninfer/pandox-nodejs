import { DataTypes, Model } from 'sequelize';

import sequelize from './sequelize';
import type { FollowAttributes } from './types';

class Follow extends Model<FollowAttributes> implements FollowAttributes {
    public followed!: string;
    public follower!: string;
}

const initFollow = () => {
    Follow.init(
        {
            followed: {
                type: DataTypes.STRING,
                references: {
                    model: sequelize.models.user,
                    key: sequelize.models.user.primaryKeyAttribute,
                },
                validate: {
                    notEqualFollower(value: any) {
                        if (value === this.follower) {
                            throw new Error(
                                'Followed and follower must be different'
                            );
                        }
                    },
                },
            },
            follower: {
                type: DataTypes.STRING,
                references: {
                    model: sequelize.models.user,
                    key: sequelize.models.user.primaryKeyAttribute,
                },
                validate: {
                    notEqualFollowed(value: any) {
                        if (value === this.followed) {
                            throw new Error(
                                'Followed and follower must be different'
                            );
                        }
                    },
                },
            },
        },
        { sequelize, modelName: 'follow' }
    );
}

export default initFollow;