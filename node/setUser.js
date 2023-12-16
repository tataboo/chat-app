var pool = require('./dbConnection');

module.exports = function (req, res, next) {
    var userId = req.session.user_id;
    if (userId) {
        var query = 'SELECT user_id, user_name FROM users WHERE user_id = ' + userId;
        pool.connect(function (err, connection) {
            connection.query(query, function (err, rows) {
                if (!err) {
                    res.locals.user = rows.rows.length ? rows.rows[0] : false;
                }
            });
        });
    }
    next();
};