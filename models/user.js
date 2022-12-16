const db = require("../db");
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");
/** User class for message.ly */



/** User of the site. */
class User {

  static async register({username, password, first_name, last_name, phone}) {
    let hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    let now = getUTCDate();
    const result = await db.query(
      `INSERT INTO users (
              username, password,
              first_name, last_name, phone,
              join_at, last_login_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPwd, first_name, last_name, phone, now, now]
    );
    return result.rows[0];
  };

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password FROM users WHERE username = $1`,
      [username]);
    const user = result.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password) === true) {
        return res.json({ message: "Logged in!" });
      }
    }
  };

  static async updateLoginTimestamp(username) {
    let now = getUTCDate();
    const result = await db.query(
      `UPDATE users SET last_login_at = ${now}
      WHERE username = ${username} RETURNING username`
    );
    if (!result.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
  }

  static async all() {
    const results = await db.query(
      `SELECT username, first_name, last_name FROM users ORDER BY last_login_at DESCENDING`
    );
    return results.rows;
  }

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at FROM users WHERE username = ${username}`
    );
    return result.rows[0];
  }

  static async messagesFrom(username) {
    const results = await db.query(
      `SELECT id, from_username, to_username, body, sent_at, read_at
      FROM messages WHERE from_username = ${username}`
    )
    return results.rows;
  }

  static async messagesTo(username) {
    const results = await db.query(
      `SELECT id, from_username, to_username, body, sent_at, read_at
      FROM messages WHERE to_username = ${username}`
    )
    return results.rows;
  }
}


module.exports = User;