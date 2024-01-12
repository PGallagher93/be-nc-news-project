const db = require("../db/connection");

exports.destroyComment = (id) => {
  return db.query(
    `DELETE FROM comments
        WHERE comment_id = $1
        `,
    [id]
  );
};

exports.updateCommentVotes = ({ inc_votes }, id) => {
  return db
    .query(
      `UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        Returning *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
