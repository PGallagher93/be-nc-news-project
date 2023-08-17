const db = require("../db/connection");

exports.findArticleById = (id) => {
  return db
    .query(`SELECT articles.author, title, articles.article_id, topic, articles.body, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }

      return rows;
    });
};

exports.readArticles = (order = 'desc', sortBy = 'created_at' , topic) => {
  const acceptedSorts = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']
  const acceptedOrders = ['asc', 'desc']
  const queryValues = []
  if(!acceptedSorts.includes(sortBy)){
    return Promise.reject({status:400, msg:'invalid sort query'})
  }
  if(!acceptedOrders.includes(order)){
    return Promise.reject({status:400, msg: 'invalid order query'})
  }
  let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`

  if(topic){
    
    queryValues.push(topic)
    queryString += ` WHERE topic = $1`
  }
  queryString += ` GROUP BY articles.article_id
  ORDER BY articles.${sortBy} ${order};`
  
  return db
    .query(
      queryString, queryValues
    )
    .then(({ rows }) => {
      
      return rows;
    });
};

exports.findCommentsByArticleId = (id) => {
  return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [id]).then(({rows}) =>{
    
    return rows
  });
};

exports.insertComment = ({username, body}, id) => {
  let date = new Date();
  
  return db.query(`
  INSERT INTO comments
  (votes, created_at, author, body, article_id)
  VALUES
  (0, $1, $2, $3, $4)
  RETURNING *
  `, [date, username, body, id]).then(({rows})=>{
    
    return rows
  })
   
}

exports.updateVotes = ({inc_votes}, id) => {
 return db.query(`UPDATE articles 
 SET votes = votes + $1
 WHERE article_id = $2 
 RETURNING *`, [inc_votes, id]).then(({rows})=>{
  return rows
 })
}