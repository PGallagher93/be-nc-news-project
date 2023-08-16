
const{checkCommentIdExists} = require("../models/check-id-models")


exports.deleteComment = (req, res, next) => {
    const{comment_id} = req.params

    const promises = [checkCommentIdExists(comment_id)]

    Promise.all(promises).then((resolvedPromises) =>{
        console.log(resolvedPromises, "<<< delete comment promises")
    }).catch(next)
}