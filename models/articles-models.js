const db = require("../db/connection");

exports.findArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      
      return rows;
    });
};
