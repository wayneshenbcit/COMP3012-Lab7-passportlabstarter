import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render('login', {messages: req.session.messages});
})


// 1. Initial route: Redirects user to GitHub for authorization
// first end porint triggered when user clicks on "Login with GitHub" button
router.get(
  "/github",
  passport.authenticate("github", {scope: ["user:email"]})
    /* FIX ME: 😭 failureMsg needed when login fails */
);

// 2. Callback route: GitHub redirects back here after authentication
// This route is triggered after GitHub redirects back to our application
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

/*
----------------------------------------------------------------------------------------------------
Some part of the following code is obtained from ChatGPT 
The query to obtain the code from ChatGPT is:
Query : giving the code below, i want to show an 'couldn't find user with email user_email@gmail.com'
when user enter a email that is not in the database. I also want to show a 'password is incorrect'
error message when the user email is in the database, but the password is incorrect.
----------------------------------------------------------------------------------------------------
*/
//passport.authenticate() is a middleware that will handle the authentication process for us. It will check the username and password against the database and if they match, it will create a session for the user and redirect them to the dashboard. If they don't match, it will redirect them back to the login page.
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true, // Stores failure message in req.session.messages
    /* FIX ME: 😭 failureMsg needed when login fails */
  })
);

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

//passport.authenticate() is a middleware that will handle the authentication process for us. It will check the username and password against the database and if they match, it will create a session for the user and redirect them to the dashboard. If they don't match, it will redirect them back to the login page.
router.post(
  "/admin",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/auth/login",
    failureMessage: true, // Stores failure message in req.session.messages
    /* FIX ME: 😭 failureMsg needed when login fails */
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
