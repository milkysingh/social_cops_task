const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const MongoService = require("./mongoService");

/**
 * @function <b>hashPasswordUsingBcrypt</b><br>
 * Hash Password
 * @param {String} plainTextPassword Unsecured Password
 * @return {String} Secured Password
 */
const hashPasswordUsingBcrypt = (plainTextPassword) => {
  const { saltRounds } = config;

  try {
    return bcrypt.hashSync(plainTextPassword, saltRounds);
  } catch (error) {
    throw error;
  }
};

/**
 * @function <b>comparePasswordUsingBcrypt</b><br> Verify Password
 * @param {String} plainTextPassword Password to be checked
 * @param {String} passwordhash Hashed Password
 * @return {Boolean} True if match else False
 */
const comparePasswordUsingBcrypt = (plainTextPassword, passwordhash) =>
  bcrypt.compare(plainTextPassword, passwordhash);

/**
 * @function <b>generateAuthToken</b><br> Generate Token
 * @param {Object} criteriaForJwt keys for jwt to generate tokens
 * @return {String} Auth Token
 */

const generateAuthToken = async (criteriaForJwt) => {
  let condition;
  let dataToUpdate;
  const token = await jwt.sign(criteriaForJwt, config.jwtSecret);
  if (token) {
    condition = {
      _id: criteriaForJwt.id,
    };
    dataToUpdate = {
      $push: { tokens: { access: "auth", token } },
    };

    try {
      await MongoService.updateUser(condition, dataToUpdate);
      return token;
    } catch (error) {
      throw error;
    }
  }
};

/**
 * @function <b>findByToken</b><br> decrypt Token
 * @param {String} token token to be decrypt
 * @return {Object} if match returns user object
 */
const findByToken = token => jwt.verify(token, config.jwtSecret);

/**
 * @function <b>findUser</b><br> Find User in Db
 * @param {String} token Password to be checked
 * @return {Object} if password macthes after decryption returns user object
 */

const findUser = async (userName, plainTextPassword) => {
  let user;
  try {
    user = await MongoService.findUserByCredentials(userName);
    if (user) {
      if (await comparePasswordUsingBcrypt(plainTextPassword, user.password)) {
        return user;
      }
    }

    return null;
  } catch (error) {
    return error;
  }
};

module.exports = {
  findByToken,
  generateAuthToken,
  comparePasswordUsingBcrypt,
  hashPasswordUsingBcrypt,
  findUser,
};
