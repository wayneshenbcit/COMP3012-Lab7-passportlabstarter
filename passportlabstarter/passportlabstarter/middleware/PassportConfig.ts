import passport from 'passport';
import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from '../interfaces';
// Add this import statement (adjust relative path if needed):
import { userModel } from "../models/userModel";

export default class PassportConfig {
    /*
     FIX ME 😭	
     The problem with this class is... if the caller forgets to call
     the addStrategies method...our program won't work. 

     Solution: You should refactor this class to take a constructor
     which receives strategies: PassportStrategy[]. Internally...call 
     the addStrategies method within the constructor and make addStragies
     private from the outside world. This way, we can GUARANTEE that our
     passport strategies are added when this class is created. ⭐️
    */
   //  private readonly strategies: PassportStrategy[];
   //  protected constructor(strategies: PassportStrategy[]) {
   //     this.strategies = strategies;
   //     this.addStrategies(strategies);
   //     // Call the addStrategies method here with the strategies passed to the constructor
   //     // this.addStrategies(strategies);
   // }

    addStrategies(strategies: PassportStrategy[]): void {
        strategies.forEach((passportStrategy: PassportStrategy) => {
            passport.use(passportStrategy.name, passportStrategy.strategy);
        });
    }
}

/*
----------------------------------------------------------------------------------------------------
Some part of the following code is obtained from ChatGPT 
The query to obtain the code from ChatGPT is:
Query 1: we want to use the GitHubStrategy from passport-github2 to authenticate users via GitHub.
We want to use the userModel to find or create a user based on the GitHub profile information.
We want to handle errors gracefully and return them to the done callback.
----------------------------------------------------------------------------------------------------
*/

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "CLIENTID",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "GITHUB_CLIENT_SECRET",
      callbackURL: "http://localhost:8000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract the string email from the GitHub profile object
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";

        // Pass the string primitive, NOT the object
        const user = userModel.findOne(email);
        if (profile) {
          const user = userModel.findOrCreate(profile);
          return done(null, user);
        } else {
          return done(new Error("GitHub profile not found"), null);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
