var jwt = require("jsonwebtoken");

const config = require("../config/auth.config");
const {pool} = require("../config/db.config");


exports.signin = (req,res) => {
    console.log(req.body.email);
    pool
    .query('SELECT * FROM users WHERE email = $1', [req.body.email])
    .then(response => {
      if(!response.rows.length){
          console.log(response);
          return res.status(404).send({message : "User not found."});
      }

      if(req.body.password!=response.rows[0].password){
          return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
          });
      }
      
      var token = jwt.sign({id: response.rows[0].id},config.secret,{
        expiresIn: 86400
      })

      
      
      pool
      .query('Select role_name from roles where user_id=$1', [response.rows[0].id])
      .then(result => {
        var authorities = [];
          console.log(result.rows[0].role_name[0]);
          for(let i=0;i<result.rows[0].role_name.length; i++){
              authorities.push("ROLE_" + result.rows[0].role_name[i].toUpperCase());
              console.log("HEYY"+authorities);
          }
          console.log(authorities);
          res.status(200).send({
            id: response.rows[0].id,
            username: response.rows[0].name,
            email: response.rows[0].email,
            roles: authorities,
            accessToken: token
          });
      })
      .catch(err =>
        setImmediate(() => {
          throw err
        })
      )  
     
    
      
      

    })
    .catch(err =>{
        res.status(500).send({ message: err.message });
    }
      
    )   
}

