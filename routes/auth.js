const express = require("express");

const Router = express.Router;
const router = new Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");
const db = require("../db");




// ##################



/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async function (req, res, next) {
    try {
        let {username} = await User.register(req.body);
        let token = jwt.sign({username}, SECRET_KEY);
        return res.json({token});
    } catch (e) {
        return next(e);
    }
});

module.exports = router;