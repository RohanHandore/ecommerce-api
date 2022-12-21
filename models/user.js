import { Schema, model } from 'mongoose'
import validator from 'validator'
import  bcryptjs  from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
const JWT_SECRET = "rohanapi"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate( value ) {
            if( !validator.isEmail( value )) {
                throw new Error( 'Email is invalid' )
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if( value.toLowerCase().includes('password')) {
                throw new Error('password musn\'t contain password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})


//Generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jsonwebtoken.sign({ _id: user._id.toString()}, JWT_SECRET)
    user.tokens = user.tokens.concat({token})
     await user.save()
    return token
}

//login in users
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email})
    if (!user) {
        throw new Error('Unable to log in')
    }
    const isMatch = await bcryptjs.compare(password, user.password)
    console.log(isMatch)
    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//Hash plain password before saving
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8)
    }

    next()
})


const User = model('User', userSchema)

export default User
