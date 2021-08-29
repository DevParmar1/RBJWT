const jwt = require("jsonwebtoken");
const { response } = require("../app.js");
const config = require("../config/auth.config.js");
const {pool} = require("../config/db.config");

verifyToken = (req,res,next) => {
    let token = req.headers["x-access-token"];

    if(!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err,decoded)=>{
        if(err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};





isAdmin = (req,res,next) => {
    pool
  .query('SELECT * FROM roles WHERE user_id = $1', [req.userId])
  .then(response => {
    if(response.rowCount>0){
        
        for (let i=0;i<response.rows[0].role_name.length;i++){
           
            if(response.rows[0].role_name[i] === "admin"){
                next();
                return;
            }
        }
    }
    
        res.status(403).send({
            message: "Require Admin Role"
        });
        return;
    
  })
  .catch(err =>
    setImmediate(() => {
      throw err
    })
  )        
        
}


isModerator = (req,res,next) => {
    console.log(req.userId);
    pool
  .query('SELECT * FROM roles WHERE user_id = $1', [req.userId])
  .then(response => {
     
    if(response.rowCount>0){  
        for (let i=0;i<response.rows[0].role_name.length;i++){
            console.log(response.rows[0].role_name[i])
            if(response.rows[0].role_name[i] === "moderator"){
                next();
                return;
            }
        }
    }
    
        res.status(403).send({
            message: "Require Moderator Role"
        });
        return;
    
  })
  .catch(err =>
    setImmediate(() => {
      throw err
    })
  )        
        
}



isModeratorOrAdmin = (req,res,next) => {
    pool
  .query('SELECT * FROM roles WHERE user_id = $1', [req.userId])
  .then(response => {
    if(response.rowCount>0){
        for (let i=0;i<response.rows[0].roles.length;i++){
            if(response.rows[0].role_name[i] === "moderator"){
                next();
                return;
            }

            if(response.rows[0].role_name[i] === "admin"){
                next();
                return;
            }
        }
    }
        res.status(403).send({
            message: "Require Moderator or Admin Role"
        });
        return;
    
  })
  .catch(err =>
    setImmediate(() => {
      throw err
    })
  )        
        
}


const auth = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
  };
  module.exports = auth;