module.exports = {
    port: process.env.PORT || 3000,
    session: {
        secret: 'Hello World',
        key: 'Some key',
    },
};
