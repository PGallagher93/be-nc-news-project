const express = require("express");
const {getTopics}= require("./controllers/topic-controllers")

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics)


module.exports = app



// Should:

// be available on endpoint /api/topics.
// get all topics.
// Responds with:

// an array of topic objects, each of which should have the following properties:
// slug
// description
// As this is the first endpoint, you will need to set up your testing suite.