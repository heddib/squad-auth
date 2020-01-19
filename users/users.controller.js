const express = require("express");
const router = express.Router();
const userService = require("./user.service");

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/:name", getUserByName);
router.get("/", getAll);
// profile
router.get("/:name/profile", getProfileByName);
router.put("/:name/profile", updateProfileByName);
router.get("/profiles/jobs", getAllJobs);

module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json({ authdata: user })
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch(err => next(err));
}

function register(req, res, next) {
  userService
    .register(req.body)
    .then(data =>
      data.success ? res.json({ data }) : res.status(400).json({ data })
    )
    .catch(err => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getAllJobs(req, res, next) {
    userService
      .getAllJobs()
      .then(jobs => res.json(jobs))
      .catch(err => next(err));
  }

function getUserByName(req, res, next) {
  userService
    .getUserByName(req.params.name)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username not found" })
    )
    .catch(err => next(err));
}

function getProfileByName(req, res, next) {
  userService
    .getProfileByName(req.params.name)
    .then(profile =>
      profile
        ? res.json(profile)
        : res.status(400).json({ message: "Profile not found" })
    )
    .catch(err => next(err));
}

function updateProfileByName(req, res, next) {
  userService
    .updateProfileByName(req.params.name, req.body)
    .then(data =>
      data.success ? res.json({ data }) : res.status(400).json({ data })
    )
    .catch(err => next(err));
}
