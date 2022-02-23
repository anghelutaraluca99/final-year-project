const { extractToken, decodeToken } = require("../utils/jwtUtils");

module.exports = (req, res, next) => {
    const token = extractToken(req);
    if (token) {
        req.user = decodeToken(token, process.env.JWT_SECRET)?.payload;
        if (req.user) {
            return next();
        }
    }
    // unauthorized

    console.log("Unauthorised access");
    return res.status(401).send({
        error: "You need a valid authorization token.",
    });
};