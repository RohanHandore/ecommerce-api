import Router  from 'express'
import findByCredentials  from '../models/user.js'
import User from '../models/user.js'
import Auth from '../middleware/auth.js'
import bcrypt from 'bcrypt' 

const router = new Router()

router.get('/users/all',async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    }
    catch (err) {
        console.log(err);
    }
    if (!users) {
        return res.status(400).json({message:"no users found"})
    }
    return res.status(200).json({users})
})


//signup
router.post('/users', async (req, res) => {
    // const user = new User(req.body)

    // try {
    //     await user.save()
    //     const token = await user.generateAuthToken()
    //     res.status(201).send({user, token})
    // } catch (error) {
    //     res.status(400).send(error)
    // }
    const {name, email , password}  = req.body;

    let exitstingUser;
    try {
        exitstingUser = await User.findOne({email});
    }
    catch (err) {
        return console.log(err);
    }
    if (exitstingUser) {
        return res.status(400).json({message:" users already exits!"})
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassowrd = bcrypt.hashSync(password,salt);
    const user= new User({
        name,
        email,
        password: hashedPassowrd,
    })
    try {
       await user.save();
    }
    catch (err) {
        return console.log(err);
    }
    return res.status(200).json({user});

})

//login

router.post('/users/login', async (req, res) => {
    // try {
    //     const user = await findByCredentials(req.body.email, req.body.password)
    //     const token = await user.generateAuthToken()
    //     res.send({ user, token})
    // } catch (error) {
    //     res.status(400).send(error)
    // }

    const {email ,password}  = req.body;
    let exitstingUser;
    try {
        exitstingUser = await User.findOne({email});
    }
    catch (err) {
        return console.log(err);
    }
    if (!exitstingUser) {
        return res.status(404).json({message:" couldnt find user by this id!"})
    }
    const inPasswordCorrect = bcrypt.compareSync(password,exitstingUser.password)
    if (!inPasswordCorrect) {
        return res.status(400).json({message:"incorrect password!"})
    }
    return res.status(400).json({message:"login succesfull!"})
})

//logout
router.post('/users/logout', Auth, async (req, res) => {
   
    try {
       req.user.tokens =  req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })

        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//Logout All 
router.post('/users/logoutAll', Auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()        
    }
})
export default router