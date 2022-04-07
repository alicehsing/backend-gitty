const pool = require('../utils/pool');

module.exports = class User {
    username;
    photoUrl;

    constructor(row) {
        this.username = row.github_username;
        this.photoUrl = row.github_photo_url;
    }


    static findByUsername(username) {
        return pool
        .query(
            `SELECT
                * 
            FROM 
                github_users
            WHERE
                github_username=$1`,
            [username]
        )
        .then(({ rows }) => {
            if (rows.length < 1) {
                return null;
            } else {
                new User(rows[0]);
            }
        })
    }

    // static async findByUsername(username) {
    //     const { rows } = await pool.query(
    //         `SELECT
    //             * 
    //         FROM 
    //             github_users
    //         WHERE
    //             github_username=$1`,
    //         [username]
    //     );

    //     if (rows.length < 1) return null;
    //     return new User(rows[0]);
    // }

    static insert({ username, photoUrl }) {
        return pool
        .query(
            `INSERT INTO
                github_users (github_username, github_photo_url)
            VALUES
                ($1, $2)
            RETURNING
                *`,
            [username, photoUrl]
        )
        .then(({ rows }) => new User(rows[0]));
    }


    // static async insert({ username, photoUrl }) {
    //     const { rows } = await pool.query(
    //         `INSERT INTO
    //             github_users (github_username, github_photo_url)
    //         VALUES
    //             ($1, $2)
    //         RETURNING
    //             *`,
    //         [username, photoUrl]
    //     );

    //     return new User(rows[0]);
    // }


    toJSON() {
        return { ...this };
    }
}