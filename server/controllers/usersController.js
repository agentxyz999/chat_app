const User = require("../model/userModel");
const bcrypt = require("bcrypt");

//register
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //check if username and email is available by querying the User model
    //in the MongoDB database
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //if all validations passed, create user to be inserted into the database
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

//login
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    //check if username is in the db
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }
    //check if provided password is the same sa user password from database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    delete user.password; // <--- remove the password property from the user object before sending it as a response to the client
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

//set avatar
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

//get all users for Contacts.jsx
module.exports.getAllUsers = async (req, res, next) => {
  try {
    //find all users but not including user own id
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
