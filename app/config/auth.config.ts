interface AuthConfig {
    secret: string;
    expire: number;
    algorithm: string;
}

const jwtExpireSeconds = Number(process.env.JWT_EXPIRE_SECONDS || 86400);

const config: AuthConfig = {
    secret: process.env.JWT_SECRET || 'local-development-secret-change-me',
    expire: Number.isFinite(jwtExpireSeconds) ? jwtExpireSeconds : 86400,
    // expire: 60,
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
};

export default config;
