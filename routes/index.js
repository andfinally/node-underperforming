module.exports = function (app) {
    app.use('/', require('./home'));
    app.use('/underperforming', require('./underperforming'));
};
