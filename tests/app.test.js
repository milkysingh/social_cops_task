const expect = require("expect");
const request = require("supertest");
const mongoose = require("mongoose");

const { app } = require("../app");

const User = mongoose.model("users");
const { populateUsers, users } = require("./seed");

/* eslint-env node, mocha */
beforeEach(populateUsers); /* eslint no-underscore-dangle: 0 */
describe("/Signup User", () => {
  it("should store the user", (done) => {
    const data = { userName: "hurdle", password: "marcusmal" };
    request(app)
      .post("/signup")
      .send(data)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBeTruthy();
        expect(res.headers["x-auth"]).toBeTruthy();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.find({ userName: data.userName })
          .then((users) => {
            expect(users.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });
  it("should not create a new user", (done) => {
    request(app)
      .post("/signup")
      .send({})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.find()
          .then((users) => {
            expect(users.length).toBe(2); // because we always seed 2 records beforeEach
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("/Signin User", () => {
  it("should login the user", (done) => {
    request(app)
      .post("/login")
      .send({ userName: users[1].userName, password: "malkeet" })
      .expect(200)
      .expect((res) => {
        expect(res.headers["x-auth"]).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then((user) => {
            expect(user.toObject().tokens[0]) // .toEqual(res.headers["x-auth"]);
              .toMatchObject({ token: res.headers["x-auth"] });

            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("patchJson", () => {
  it("should return if user is authenticated", (done) => {
    request(app)
      .get("/patchJson?json={\"malkeet\":\"first\"}&patchObj=[ { \"op\": \"add\",\"path\":\"/last\",\"value\": \"Singh\" }]")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.last).toEqual("Singh");
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it("shouldnt return if user is not authentcated", (done) => {
    request(app)
      .get("/patchJson?json={\"malkeet\":\"first\"}&patchObj=[ { \"op\": \"add\",\"path\":\"/last\",\"value\": \"Singh\" }]")
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
