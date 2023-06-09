//setup an endpoint for registering a user
const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require("../controllers/usersController");

const router = require("express").Router();

//endppoints
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);

module.exports = router;
