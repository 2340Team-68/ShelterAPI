process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const should = chai.should();

var server = require('../index');
const resetDB = require('../helpers/env/envsetup').resetDB;
const models = require('../models');
const User = models.User;
const UserType = require('../helpers/auth/usertypes');

const validUser = {
  email: "chad@gmail.com",
  name: "Chad Brunderman",
  password: "dangBobby!",
  type: UserType.HOMELESS
}

const duplicateUser = {
  email: "adam@gmail.com",
  name: "Adam Cloneman",
  password: "dangBobby!",
  type: UserType.HOMELESS
}

describe('user', function() {
  // run this at the beginning of all the tests
  before(function(done) {
    this.timeout(5000);
    models.sequelize.sync({
      force: true,
      logging: () => {}
    }).then(()=> done());
  });

  // run this at the end of all the tests
  after(function(done) {
    done();
  });

  // run this before each test
  beforeEach(function(done){
    this.timeout(7000);
    User.create({
      email: duplicateUser.email,
      name: duplicateUser.name,
      password_hash: "!!!!!!!!!!pretendhash!!!!!!!!!!",
      type: duplicateUser.type
    }).then(() => done());
  });

  // run this after each test
  afterEach(function(done){
    this.timeout(7000);
    User.destroy({
      truncate :{
        cascade: true
      }
    })
    .then(() => done());
  });

  it('should register a new user with the register function', (done) => {
    User.register(validUser.email,validUser.name,
                  validUser.password, validUser.type)
      .then((user) => {
        var email = user.getDataValue('email');
        should.exist(email);
        var hashedPassword = user.getDataValue('password_hash');
        should.exist(hashedPassword);
        email.should.equal(validUser.email);
        hashedPassword.should.not.equal(validUser.password);
        console.log("success");
      }, (err) => {
        should.not.exist(err);
        console.log(err);
      }).then(() => done());
  });

  it('should respond with a 501 error if the user type is '
      + 'admin (not implemented)', (done) => {
    User.register(validUser.email,validUser.name,
                  validUser.password, UserType.ADMIN)
      .then((user) => {
        should.not.exist(user);
      }, (err) => {
        should.exist(err);
        should.exist(err.code);
        err.code.should.equal(501); // the not implemented error
      }).then(() => done());
  });

  it('should respond with a 501 error if the user type is '
      + 'employee (not implemented)', (done) => {
    User.register(validUser.email, validUser.name,
                  validUser.password, UserType.EMPLOYEE)
      .then((user) => {
        should.not.exist(user);
      }, (err) => {
        should.exist(err);
        should.exist(err.code);
        err.code.should.equal(501); // the not implemented error
      }).then(() => done());
  });

  it('should respond with a 501 error if the user type is '
      + 'owner (not implemented)', (done) => {
    User.register(validUser.email,validUser.name,
                  validUser.password, UserType.OWNER)
    .then((user) => {
      should.not.exist(user);
    }, (err) => {
      should.exist(err);
      should.exist(err.code);
      err.code.should.equal(501); // the not implemented error
    }).then(() => done());
  });

  it("should respond with a 500 error if the user type "
      +"doesn't exist", (done) => {
    User.register(validUser.email, validUser.name,
                  validUser.password, "42")
      .then((user) => {
        should.not.exist(user);
      }, (err) => {
        should.exist(err);
        should.exist(err.code);
        err.code.should.equal(500); // the user type doesn't exist
      }).then(() => done());
  });

  it("should respond with a 409 error if the user email "
      + "is already in use", (done) => {
    User.register(duplicateUser.email, duplicateUser.name,
                  duplicateUser.password, duplicateUser.type)
      .then((user) => {
        // the user should not have been created!
        should.not.exist(user);
      }, (err) => {
        should.exist(err);
        should.exist(err.code);
        err.code.should.equal(409);
      }).then(() => done());
  })
});
