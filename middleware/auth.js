import jsonwebtoken from 'jsonwebtoken'
import User from '../models/user.js'

const JWT_SECRET = "rohanapi"

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jsonwebtoken.verify(token, JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token })
        
        if(!user) {
            throw new Error
        }
        req.token = token
        req.user = user
        console.log(req.user,req.token)
        
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({error: "Authentication required"})
    }
}

export default auth