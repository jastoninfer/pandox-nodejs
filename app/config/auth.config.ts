interface AuthConfig {
    secret: string;
    expire: number;
    algorithm: string;
}

const config: AuthConfig = {
    secret: 'pandox-2024-secret-key-wJ8i981sD',
    expire: 86400 /* 24hours */,
    // expire: 60,
    algorithm: 'HS256',
};

export default config;
