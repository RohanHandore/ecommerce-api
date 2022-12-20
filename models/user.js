import mongoose from 'mongoose'
import compare from 'bcryptjs'
import bcryptjs  from 'bcryptjs'
import sign from 'jsonwebtoken'

const userSchema = mongoose.Schema({
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
    }
    ,
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
    const token = sign({ _id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
     await user.save()
    return token
}

//login in users
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to log in')
    }
    const isMatch = await compare(password, user.password)
    console.log(isMatch)
    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//Hash plain password before saving
// userSchema.pre('save', async function(next) {
//     const user = this
//     if (user.isModified('password')) {
//         user.password = await bcryptjs.hash(user.password, 8)
//     }

//     next()
// })


const User = mongoose.model('User', userSchema)

export default User
