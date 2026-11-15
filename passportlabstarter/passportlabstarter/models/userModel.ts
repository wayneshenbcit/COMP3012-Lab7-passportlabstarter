export type TUser = {
  id: number;
  name: string;
  email?: string;
  password?: string;
  role?: string;
  sessionId?: string;
};

export interface User extends TUser {
}

const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "admin",
    sessionId: "", 
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "user",
    sessionId: "",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "user",
    sessionId: "", 
  },
];

const userModel2 = {

  /* FIX ME (types) 😭 */
  findOne: (email: string) => {
    //if there is a MySQL database, we can use the userModel to find the user and check the password
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  /* FIX ME (types) 😭 */
  findById: (id: number) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
};


/*
----------------------------------------------------------------------------------------------------
The following code is obtained from ChatGPT 
The query to obtain the code from ChatGPT is:
Query: giving the code below, i want to show an 'couldn't find user with email user_email@gmail.com'
when user enter a email that is not in the database. I also want to show a 'password is incorrect'
error message when the user email is in the database, but the password is incorrect..
----------------------------------------------------------------------------------------------------
*/

const userModel = {
  
  findOne: (email: string): User | null => {
    const user = database.find((u) => u.email === email);
    return user || null;
  },
  findById: (id: number): User | null => {
    const user = database.find((u) => u.id === id);
    return user || null;
  },

  // ADD THIS FUNCTION
  findOrCreate: (profile: Express.User): User => {
    // 1. Try to find user by githubId or profile id
    let user = database.find(
      (u) => u.id === Number(profile.id)
    );

    // 2. If user exists, return them
    if (user) {
      return user;
    }

    // 3. Otherwise, create a new user object and add to database
    const newUser: User = {
      id: Number(profile.id) || database.length + 1,
      name: profile.displayName || profile.username || "GitHub User",
      email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
      role: "user",
      sessionId: "", // Initialize with an empty string or generate a new session ID  
       };

    database.push(newUser);
    return newUser;
    },
};


export { database, userModel };
