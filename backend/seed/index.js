import User from "../models/user.js";

const createAdminUser = async () => {
  const user = new User({
    email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
    fullname: 'Admin Name',
    password: process.env.ADMIN_PASSWORD || 'password',
    role: 'admin'
  });

  await user.save();
}

export default () => {
  User.findOne({ role: 'admin' })
  .then(user => {
    if (!user) {
      return createAdminUser();
    }
    return user;
  })
}