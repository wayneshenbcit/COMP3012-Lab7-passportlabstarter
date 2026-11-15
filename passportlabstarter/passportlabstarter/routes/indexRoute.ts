import express from "express";
const router = express.Router();
import { ensureAuthenticated, isAdmin } from "../middleware/checkAuth";

router.get("/", (req, res) => {
  res.send(
    "<pre><strong>http://localhost:8000/auth/login</strong> for the login page. </pre><pre><strong>http://localhost:8000/dashboard</strong> for the dashboard (requires login).</pre>",
  );
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});


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

// GET /admin - Display all active sessions (Admins only)
router.get("/admin", ensureAuthenticated, isAdmin, (req: any, res) => {
  req.sessionStore.all((err: any, sessions: any) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving active sessions");
    }

    const activeSessions = Object.keys(sessions || {})
      .map((sessionId) => {
        // Parse the session if MemoryStore stored it as a JSON string
        const rawSession = sessions[sessionId];
        const sessionData =
          typeof rawSession === "string" ? JSON.parse(rawSession) : rawSession;

        return {
          sessionId: sessionId,
          userId: sessionData?.passport?.user ?? "Unauthenticated",
        };
      })
      .filter((s) => s.userId !== "Unauthenticated");

    res.render("admin", {
      user: req.user,
      currentSessionId: req.sessionID,
      sessions: activeSessions,
    });
  });
});

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

// POST /admin/revoke - Destroy a specific user's session
router.post("/admin/revoke", ensureAuthenticated, isAdmin, (req: any, res) => {
  const { sessionId } = req.body;
  if (sessionId) {
    req.sessionStore.destroy(sessionId, (err: any) => {
      if (err) console.error(err);
      res.redirect("/admin");
    });
  } else {
    res.redirect("/admin");
  }
});

export default router;
