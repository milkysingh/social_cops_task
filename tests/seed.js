const jwt = require("jsonwebtoken");
const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const userService = require("../services/userService");
const config = require("../config/config");

const userOne = new ObjectID();
const userTwo = new ObjectID();
const users = [
  {
    _id: userOne,
    userName: "marcusmal",
    password: userService.hashPasswordUsingBcrypt("malkeet"),
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOne }, config.jwtSecret)
      }
    ]
  },
  {
    _id: userTwo,
    userName: "milkysingh",
    password: userService.hashPasswordUsingBcrypt("malkeet")
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();
      return Promise.all([user1, user2]);
    })
    .then(() => done());
};
module.exports = {
  populateUsers,
  users
};
