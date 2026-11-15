import { NextFunction } from "express";

/*
FIX ME (types) 😭
*/
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}

/*
----------------------------------------------------------------------------------------------------
The following code is obtained from ChatGPT 
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

// Restrict access strictly to admin users
export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user?.role === "admin") {
    return next();
  }
  // Redirect regular users away from /admin
  res.redirect("/dashboard");
};
