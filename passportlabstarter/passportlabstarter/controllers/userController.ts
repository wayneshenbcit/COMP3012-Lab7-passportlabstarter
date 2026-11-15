import {userModel} from "../models/userModel";

//if there is a MySQL database, we can use the userModel to find the user and check the password
const getUserByEmailIdAndPassword = (email: string, password: string) => {
  let user = userModel.findOne(email);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};


const getUserById = (id:any) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user: any, password: string) {
  return user.password === password;
}

export {
  getUserByEmailIdAndPassword,
  getUserById,
};
