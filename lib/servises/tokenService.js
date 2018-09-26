const jwt = require('jsonwebtoken');
const { access, algorithm } = require('../../configs/token');

module.exports = class TokenService {
    static accessToken(userData) {
        const config = {
            payload: {
                tokenType: access.type,
                email: userData.email,
                id: userData.id,
                phone: userData.phone,
            },
            options: {
                algorithm,
                subject: userData.id.toString(),// eslint-disable-line
                expiresIn: access.expiresIn,
            },
        };
        return jwt.sign(config.payload, access.secret, config.options, config.email);
    };
};
