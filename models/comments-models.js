const db = require("../db/connection")


exports.destroyComment = (id) =>{
    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1
        `, [id]
    )
}