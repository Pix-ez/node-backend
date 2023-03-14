const {Router} = require('express');
const db = require('../database'); 
const router = Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const JWT_SECRET =
  "hedvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

//Middelware
// router.use((req, res, next) => {
//     console.log("request made to the /users route");
//     next();
// });

const verifyJWT = (req, res ,next)=>{
  const token = req.headers["x-access-token"]

  if(!token){
    res.send("we nedd token")
  }else{
    jwt.verify(token, secret, (err, decode)=>{
      if(err){
        res.json({auth:false , message:"u failed to authenticated"});
      }else{
        req.userid= decode.id;
        next();
      }
    })
  }
}

//CURD methods--
//GET methods -
//get all users
router.get('/getuser/:id', (req, res) =>{
    const getuser = "SELECT * FROM `user_info` WHERE `id` =" +req.params.id;
    db.query(getuser, function(err, result){
        if(err){
            console.log(err);
            res.send("unable to get users");
        }else{
            res.send(result);


        }
    })
})

//get all users
router.get('/getusers', (req, res) =>{
    const getuser = "SELECT * FROM `user_info`";
    db.query(getuser, function(err, result){
        if(err){
            console.log(err);
            res.send("unable to get users");
        }else{
            res.send(result);


        }
    })
})

//user logged in or not
// router.get("/login", (req, res) =>{
//   if(req.session.user){
//     res.send({loggedIn: true, user: req.session.user})
//   } else{
//     res.send({loggedIn: false})
//   }
// })

//POST METHOD
//contact-
router.post('/contact', (req, res) =>{
    
  const adduser =`INSERT INTO contact(username, email, message) VALUES (?, ?, ?)`;
  const user = req.body;
  const username = user.username;
  const email = user.email;
  const message = user.message
 
    if(user){
      try {

          db.query(adduser,[username, email ,message]);
          res.json({msg: 'message submited'});
          console.log("message submited")
         
      } catch (error) {
          console.log(error);
         
          
      }
      
  }

  })
 

//add user
router.post('/register', (req, res) =>{
    
    const adduser =`INSERT INTO user_info(username, email, password_hash) VALUES (?, ?, ?)`;
    const user = req.body;
    const username = user.username;
    const email = user.email;
   
    

    bcrypt.hash(user.password_hash,saltRounds, (err, hash)=>{

      if(user){
        try {

            db.query(adduser,[username, email ,hash]);
            res.status(201).send({msg: 'User created'});
            console.log("user created succesfully")
           
        } catch (error) {
            console.log(error);
           
            
        }
        
    }

    })
   
})

// router.get('/isUserAuth', verifyJWT , (res,req) =>{
//   res.send("u are authenticated")
// })

//login method

  
router.post('/login', async (req,res)=>{
  const email = req.body.email;
  const password = req.body.password_hash;

  
  db.query("SELECT * FROM user_info WHERE email = ?;",
  email, 
  (err, result)=>{
    if(err){
      res.send({err: err});
    }
    if(result.length>0){
      // console.log(result[0])
      bcrypt.compare(password, result[0].password_hash, (error , response) =>{
        if(response){
          // console.log(response)
          

          const email = result[0].email
          const token = jwt.sign({email}, JWT_SECRET, {
            expiresIn:"50m",
          })
          // req.session.user = result;



          res.status(201);
          res.json({auth:true , token: token , result:result});
          console.log("logged in");
          // console.log(req.session.user);
        }else{
          res.json({auth:false, message:"wrong id/password"});
        }
      })
    }else{
      res.json({auth:false ,message:"no user exist" });
    }
  })
})
  

//Userdata
router.post('/userData', async(req, res)=>{
  const {token} = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err,res)=>{
      if(err){
        return "token expired";
      }
      return res;
    })
    console.log(user);
    if(user == "token expired"){
      return res.send({status: "error", data:"token expired"})
    }
    const useremail =user.email;

    db.query("SELECT * FROM user_info WHERE email = ?;",
     useremail,
     (err, result)=>{
      if(err){
        res.send({err:err});
      }if(result.length > 0){
        res.send({status:"ok", data:result})
      }
     } )

   
  } catch (error) {
    res.send({ status: "error", data: error });
    
  }
})

//logout


//forget password
// router.post('/forget-password', async (req, res) => {
//   const { email } = req.body;

//   try {
//     db.query("SELECT * FROM user_info WHERE email = ?;", email, (err, oldUser) => {
//       if (err) {
//         res.send({ err: err });
//       }

//       if (oldUser.length > 0) {
//         const secret = JWT_SECRET + oldUser[0].password_hash;
//         const token = jwt.sign({ email: oldUser[0].email, id: oldUser[0].id }, secret, {
//           expiresIn: "2m",
//         });
        

//         const link = `http://localhost:5173/set-pass/${oldUser[0].id}/${encodeURIComponent(token)}`;
//         console.log(link);

//         res.json({ status: true });
//       } else {
//         return res.json({ status: false });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
router.post('/forget-password', async (req, res) => {
  const { email } = req.body;

  try {
    db.query("SELECT * FROM user_info WHERE email = ?;", email, (err, oldUser) => {
      if (err) {
        res.send({ err: err });
      }

      if (oldUser.length > 0) {
        const secret = JWT_SECRET + oldUser[0].password_hash;
        const token = jwt.sign({ email: oldUser[0].email, id: oldUser[0].id }, secret, {
          expiresIn: "2m",
        });
        
        const link = `http://localhost:5173/set-pass/${oldUser[0].id}/${Buffer.from(token).toString('base64')}`;
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'talekarrahul111@gmail.com',
            pass: 'vxtdtvhiardhwbeq'
          }
        });
        
        var mailOptions = {
          from: 'datavisualize-no-reply@gmail.com',
          to: 'varad.warekar.7818@gmail.com',
          subject: 'Password Reset Link',
          html: `
          <html lang="en">
          
            <head>
              <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
            </head>
            
          
            <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
              <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px">
                <tr style="width:100%">
                  <td><h1 style="margin-bottom: 4; padding: 5px; color: #5F51E8; font-weight: bolder; margin-left: 2px;" >
                    Data Analysis Service
                  </h1>
                    <p style="font-size:16px;line-height:26px;margin:16px 0">Hi ${oldUser[0].username} 👋,</p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0">This is the link for resseting password. Take note that this link will be valid for next 2 minutes.</p>
                    <table style="text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                      <tbody>
                        <tr>
                          <td><a href= ${link} target="_blank" style="background-color:#5F51E8;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;line-height:100%;max-width:100%;padding:12px 12px"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#5F51E8;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">Reset Password</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                        </tr>
                      </tbody>
                    </table>
                    <p style="font-size:16px;line-height:26px;margin:16px 0">From,<br />Rahul Talekar.</p>
                    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
                    <p style="font-size:12px;line-height:24px;margin:16px 0;color:#8898aa">India , Thane-Dombivli 421202.</p>
                  </td>
                </tr>
              </table>
            </body>
          
          </html>`
        }
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        console.log(link);

        res.json({ status: true });
      } else {
        return res.json({ status: false });
      }
    });
  } catch (error) {
    console.log(error);
  }
});



//reset password
router.get('/reset-password/:id/:token', async (req, res) =>{
  const {id, token } = req.params;

  db.query(`SELECT * FROM user_info WHERE id = ?;`, id,
    (err,user)=>{
      if(err){res.send({err:err})}
      if(user.length >0){
        const secret = JWT_SECRET + user[0].password_hash;
        try {
          const verify = jwt.verify(token, secret);
          res.json({ verified: true, email: user[0].email });
        } catch (error) {
          res.json({ verified: false });
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });
});

//change password
router.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  // Check if the user with the given id exists in the DB
  db.query(`SELECT * FROM user_info WHERE id = ?;`, id, async (err, user) => {
    if (err) {
      res.status(500).json({ error: "Error resetting password" });
    }

    if (user.length > 0) {
      // Get the user's password hash and create a secret for the JWT verification
      const secret = JWT_SECRET + user[0].password_hash;

      try {
        // Verify the token
        const verify = jwt.verify(token, secret);

        // Hash the new password and update the user's password hash in the database
        const passwordHash = await bcrypt.hash(password, saltRounds);
        db.query(`UPDATE user_info SET password_hash = ? WHERE id = ?`, [passwordHash, id], (err, result) => {
          if (err) {
            res.status(500).json({ error: "Error resetting password" });
          } else {
            res.json({ success: true });
          }
        });
      } catch (error) {
        res.status(401).json({ error: "Invalid or expired reset token" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});



module.exports = router;

