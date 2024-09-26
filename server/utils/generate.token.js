import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) => {
    try {
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '15d'})
        res.cookie('access_token', token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // MS
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: 'strict' // CSRF cross-site request forgery attacks
        })        
    } catch (error) {
        console.log('Error in Generating token or setting up a cookie : ', error.message)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

export default generateTokenAndSetCookie