const {verify} = require('jsonwebtoken')

const valdateToken = (req,res,next) =>{
    const accessToken = req.header("accessToken")
    if(!accessToken) return res.json({error:"Suser not logged in !"})
    try {
        const validToken = verify(accessToken,"importantsecret")
        if(validToken){
            req.user = validToken
            return next()
        }
    } catch (error) {
        return res.json({error:error})
    }
}

module.exports = {valdateToken}

