const {readTopics} = require("../models/topic-models")


exports.getTopics = (req, res, next) =>{

      readTopics().then((data) =>{
        return res.status(200).send(data)
      })
}