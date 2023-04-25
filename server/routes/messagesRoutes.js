//setup an endpoint for messages
const {
  addMessage,
  getAllMessages,
} = require("../controllers/messagesController");

const router = require("express").Router();

//endppoints
router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessages);

module.exports = router;
