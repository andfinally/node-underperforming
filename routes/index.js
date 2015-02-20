module.exports = function (app) {
    app.use('/', require('./home'));
    app.use('/api', require('./api'));
};
