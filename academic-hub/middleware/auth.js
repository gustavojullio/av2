// academic-hub/middleware/auth.js
module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'Por favor, faça login para ver esta página.');
            res.redirect('/');
        }
    },
};