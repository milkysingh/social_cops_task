const Sharp = require("sharp");
const http = require("http");
const https = require("https");
const fs = require("fs");
const winston = require("winston");

const createThumbnail = async imgURL =>
  new Promise((resolve, reject) => {
    const resizeImage = new Sharp().resize(50, 50);
    try {
      let httpLib = http;
      if (/^https/.test(imgURL)) {
        httpLib = https;
      }
      httpLib.get(imgURL, (downloadStream) => {
        const outputPath = `./output ${new Date()}.jpg`;
        const writable = fs.createWriteStream(outputPath);
        downloadStream.pipe(resizeImage).pipe(writable);

        downloadStream.on("end", () => {
          winston.log("log", "completed");
        });
        writable.on("finish", () => {
          resolve(outputPath);
        });
        writable.on("error", (err) => {
          reject(err);
        });
        downloadStream.on("error", (err) => {
          reject(err);
        });
      });
    } catch (error) {
      winston.log("error", error);
      reject(error);
    }
  });

module.exports = {
  createThumbnail,
};
