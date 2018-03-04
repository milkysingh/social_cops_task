const authenticate = require("../middlewares/authenticate");
const utils = require("../utils/util");
const fs = require("fs");
const jsonpatch = require("jsonpatch");
const jimp = require("jimp");
module.exports = app => {
  app.get("/downloadThumbnail/*", authenticate, async (req, res) => {
    const imageUri = req.params["0"];
    try {
      const thumbnail = await utils.createThumbnail(imageUri);
      fs.readFile(thumbnail, (err, content) => {
        if (err) {
          console.log("Err>>>>>>>", err);
          throw err;
        }
        if (!err) {
          res.status(200).send(content);
        }
      });
    } catch (error) {
      console.log("Err>>>>>>>", error);
      res.status(400).send(error);
    }
  });

  app.get("/patchJson", authenticate, (req, res) => {
    const mydoc = JSON.parse(req.query.json);
    const thepatch = JSON.parse(req.query.patchObj);

    const result = jsonpatch.apply_patch(mydoc, thepatch);
    res.status(200).send(result);
  });
};
