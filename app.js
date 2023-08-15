const express = require("express");
const {getTopics}= require("./controllers/topic-controllers")
const {handleCustomErrors, handleErrors} = require("./error-handlers")
const {getArticleById, getAllArticles} = require("./controllers/articles-controllers")
const {getEndpoints} = require("./controllers/api-controller")
const app = express();

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getAllArticles)

app.post('/api/articles/:article_id/comments')

app.use((req, res) => {
    res.status(404).send({msg: "not found"})
})

app.use(handleCustomErrors)

app.use(handleErrors)






module.exports = app



