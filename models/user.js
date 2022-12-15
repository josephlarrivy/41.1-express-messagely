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
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;