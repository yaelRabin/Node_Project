import  jwt  from 'jsonwebtoken'

function authAdamin(req, res, next) {
    let token = req.headers['access-token'];
    if (!token)
        return res.status(401).json({ type: 'request not authorised', message: 'token missing' });
    try {
        let decodedToken = jwt.verify(token, process.env.JWT_STR)
        if (decodedToken.role != 'ADMIN')
            return res.status(403).json({ type: 'forbidden error', message: 'user is not premitted' })
        next()
    }
    catch (error) {
        res.status(401).json({ type: 'request not authorised', message: error.message })
    }
}
export default authAdamin;