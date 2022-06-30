import { UserType } from "controllers/authControllers";
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'The email is required'],
    validate: [isEmail, 'Your email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Please enter the pass'],
    minLength: [6, "the pass shouldn't be shorter then 6 characters"]
  }
})

userSchema.statics.login = async (email: string, password: string) => {
  const user: UserType = await User.findOne({ email });
  if (user) {
    const auth = password === user.password
    if (auth) {
      return user;
    }
    throw Error('Email or Password is not correct!')
  }
  throw Error('Email or Password is not correct!')
}

// userSchema.pre('save', async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// })

const User = mongoose.model('User', userSchema)

module.exports = User;