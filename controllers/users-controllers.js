const {readUsers} = require("../models/users-models")



exports.getAllUsers = (req, res, next) =>{
    readUsers().then((users) =>{
        res.status(200).send(users)
    }).catch(next)
}