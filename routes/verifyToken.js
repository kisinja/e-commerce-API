const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.headers;
    if (authHeader) {
        console.log(authHeader);
        const token = authHeader.split(" ")[1];
        jwt.verify(token, "elvis", (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid");
            } else {
                req.user = user;
                console.log(user);
                next();
            }
        });
    } else {
        return res.status(401).json("You are not authenticated");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if ( req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    });
};

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};