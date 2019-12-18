import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

const ROLE_USER = 0;
const ROLE_ADMIN = 10;

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  emailVerificationToken: String,
  emailVerified: Boolean,

  password: String,
  salt: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  name: String,
  firstname: String,
  username: { type: String, unique: true },
  roles: {
    type: [{
      type: Number,
      enum: [ROLE_ADMIN, ROLE_USER],
    }],
    default: [ROLE_USER],
  },
}, { timestamps: true });

// // Password hashing
// UserSchema.pre('save', async function (next) {
//   const user = this;
//   if (!user.isModified('password')) return next();

//   const hash = await bcrypt.hash(user.password, this.salt);
//   user.password = hash;
//   return next();
// });

// // Helper method for validating user's password.
// UserSchema.methods.comparePassword = function (candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, (err, isMatch) => cb(err, isMatch));
// };
// // Creating user-specific salt
// UserSchema.methods.makeSalt = () => Math.round(Math.random() * 5 + 7).toString(); //  Between 8 and 12

const User = mongoose.model('User', UserSchema);

export default User;
