import jwt from 'jsonwebtoken'

function auth(req, res, next) {
    let token = req.headers['access-token'];
    if (!token)
        return res.status(401).json({ type: 'request not authorised', message: 'token missing' });
    try {
        let decodedToken = jwt.verify(token, process.env.JWT_STR)
        req.userToken = decodedToken;
        next()
    }
    catch (error) {
        res.status(401).json({ type: 'request not authorised', message: error.message })
    }
}

export default auth