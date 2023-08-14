const fs = require("fs/promises");

exports.getEndpoints = (request, response, next) =>{
    fs.readFile("./endpoints.json", "utf-8").then((data)=>{
        const endpoints = JSON.parse(data)
        
        
        
        return response.status(200).send(endpoints)
        
    }).catch((err) =>{
        next(err)
    })
}