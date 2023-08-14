const db = require("../db/connection")

exports.readTopics = () =>{
    let queryString = `SELECT * FROM topics`
    return db.query(queryString).then(({rows}) => {
        return rows
    })
} 