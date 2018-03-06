const mongoose = require("mongoose");

const User = mongoose.model("users");
/**
 * @function <b>createNewUser</b><br>
 * @param {Object} data User's data
 * @return {Object} Mongo Document
 */
const createNewUser = (data) => {
  const user = new User(data);
  return user.save();
};
/**
 * @function <b>updateUser</b><br>
 * @param {Object} condition 'Condition for Update'
 * @param {Object} update 'data to updat
 */
const updateUser = async (condition, update) => {
  await User.update(condition, update);
};
/**
 * @function <b>findUserByCredentials</b><br>
 * @param {string} userName 'userName of the user to check if it exist'
 * @return {Object} return user if matched
 */
const findUserByCredentials = userName => User.findOne({ userName });

module.exports = {
  createNewUser,
  updateUser,
  findUserByCredentials,
};
