import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/UserModel';

export default function config() {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({ email }).then((user) => {
        if (!user)
          return done(null, false, { message: "Cet email n'existe pas." });

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) return done(null, user);
          return done(null, false, { message: 'Mot de passe incorrect.' });
        });
      }).catch(console.error);
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      // TODO: remove password field from user object here.
      done(err, user);
    });
  });
}
