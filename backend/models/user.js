import mongoose from "mongoose";
import bcrypt from "bcrypt";

import config from "../config/config.js";

const User = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true
  }
});

User.pre('save', function(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(parseInt(config.SALT_WORK_FACTOR, 10), (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err1, hash) => {
      if (err1) return next(err1);

      user.password = hash;
      next();
    });
  });
});

User.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

if (!User.options.toObject) {
    User.options.toObject = {};
}

User.options.toObject.transform = (doc, ret) => {
  return {
    _id: ret._id,
    email: ret.email,
    fullname: ret.fullname,
    role: ret.role,
  };
};

const UserModel = mongoose.model('User', User);

export default UserModel;