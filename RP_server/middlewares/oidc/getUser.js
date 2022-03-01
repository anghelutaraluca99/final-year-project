module.exports = async (req, res, next) => {

    const token = extractToken(req);
    if (token) {
        req.user = decodeToken(token, process.env.JWT_SECRET)?.payload;
        if (!req.user) 
            req.error = "Invalid token";
    } else {
        req.error = "No user token found";
    }
    
    return next();
}