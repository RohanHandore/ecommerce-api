import verify  from 'jsonwebtoken'
import User from '../models/user.js'

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace(/^Bearer\s/, '');
        const decoded = verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token })
        
        if(!user) {
            throw new Error
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({error: "Authentication required"})
    }
}

export default auth