import passport, { Profile } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { PassportStrategy } from '../../interfaces/index';
import { TUser, userModel } from "../../models/userModel";

/*
FIX ME (types) 😭
*/

declare global {
  namespace Express {
    interface User extends TUser {
    }
  }
};

/*
----------------------------------------------------------------------------------------------------
Some part of the following code is obtained from ChatGPT 
The query to obtain the code from ChatGPT is:
Query: giving the code below, i want to show an 'couldn't find user with email user_email@gmail.com'
when user enter a email that is not in the database. I also want to show a 'password is incorrect'
error message when the user email is in the database, but the password is incorrect.
----------------------------------------------------------------------------------------------------
*/

const localStrategy = new LocalStrategy(
  {   
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    //if there is a MySQL database, we can use the userModel to find the user and check the password
    //const user = getUserByEmailIdAndPassword(email, password);
    //if (user) {
    //  return done(null, user);
    //} else {
    //  return done(null, false, {
    //    message: "Your login details are not valid. Please try again",
    //  });
    //}
    const user = userModel.findOne(email);

    // 1. Email is not in the database
    if (!user) {
      return done(null, false, {
        message: `couldn't find user with email ${email}`,
      });
    }

    // 2. Email exists, but password is incorrect
    if (user.password !== password) {
      return done(null, false, {
        message: "password is incorrect",
      });
    }

    // 3. Valid credentials
    return done(null, user);

  }
);


passport.serializeUser(function (user: Express.User, done) {
  done(null, user.id);
});


/*
----------------------------------------------------------------------------------------------------
Some part of the following code is obtained from ChatGPT 
The query to obtain the code from ChatGPT is:
Query: giving the code below, i want to display the active session id
when user go to this page http://localhost:8000/admin
and only when the user role is admin.
if the user role is user, they can not access this page http://localhost:8000/admin
it should also show a list of  current sessions, and the ID of the user that session belongs to.
Next to each session should be a "revoke" button. 
When clicked, it should destroy that user's session.
----------------------------------------------------------------------------------------------------
*/

/*
FIX ME (types) 😭
*/
passport.deserializeUser(function (req: any, id: number, done: any) {
  let user = userModel.findById(id);
  if (user) {
    // Attach the active Express sessionID directly onto the user object
    done(null, { ...user, sessionId: req.sessionID });
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
