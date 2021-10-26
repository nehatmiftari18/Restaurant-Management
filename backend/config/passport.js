import { Strategy as JWTStrategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import config from './config.js';
import User from '../models/user.js';

export default (passport) => {
  const jwtFromRequest = (req) => {
    let token = jwt.sign({ id: 0 }, config.JWT_SECRET, {
      expiresIn: 86400, // expires in 24 hours
    });

    const field = req && req.headers.authorization;
    if (field && field.startsWith('Bearer ')) {
      token = field.slice(7);
    }

    return token;
  };

  const opts = {
    jwtFromRequest,
    secretOrKey: config.JWT_SECRET,
    passReqToCallback: true
  };

  passport.use(new JWTStrategy(opts, (req, payload, done) => {
    if (payload.id === 0) {
      return done(null, false);
    }

    User.findById(payload.id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    });
  }));

};
