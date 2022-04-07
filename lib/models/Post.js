const pool = require('../utils/pool');

module.exports = class Post {
    id;
    text;
    username;

    constructor(row) {
        this.id = row.id;
        this.text = row.text;
        this.username = row.username;
    }

    static async insert({ text, username }) {
        // pool.query(
        //     `INSERT INTO
        //         posts (text, username)
        //     VALUES
        //         ($1, $2)
        //     RETURNING
        //         *`,
        //     [text, username]
        // )
        // .then(({ rows }) => new Post(rows[0]))
        // console.log('rows', rows);

        const { rows } = await pool.query(
            `INSERT INTO
                posts (text, username)
            VALUES
                ($1, $2)
            RETURNING
                *`,
            [text, username]
        );
        console.log('rows', rows);

        return new Post(rows[0]);
    }

    static async getAll() {
        const { rows } = await pool.query(
            `SELECT
            *
            FROM
            posts`
        );
        return rows.map((row) => new Post(row));
    }
};
