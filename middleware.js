const jwt = require('jsonwebtoken');
const secret = "my_secret";

const withAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(403).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.email = payload.email;
                next();
            }

        })
    }
};

module.exports = withAuth;