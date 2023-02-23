const {Router} = require('express');
const db = require('../database');
const { google } = require("googleapis"); 
const path = require("path");
const router = Router();


const KEYFILEPATH = path.join(__dirname, '../credentials.json');
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});




//create new project
router.post('/newpr', (req, res)=>{
    const data = req.body
    const name = data.name
    const desc = data.desc
 
    
    const id = data.id
    const newpr = `INSERT INTO projects(name, description , user_id)`


    if(data){
        try {
        console.log(name)
        console.log(desc)
        

        db.query("INSERT INTO projects(name, description , user_id) VALUES (?, ?, ?);",
        [name,desc,id])

        res.json({msg: true})
            
        } catch (error) {
            
        }
        
    }else {
        console.log("Data not found")
        res.status(400).send("Data not found")
    }


})

//get all project of user
router.get('/get_name/:id', (req, res)=>{
    const user_id = req.params.id;;
    db.query("SELECT * FROM `projects` WHERE user_id=?;" , user_id, 
    (err, result)=>{
        if(err){
            res.json({err: err});
          }
        if(result.length >0 ){
            res.json({project: result})
        }
        else{
            res.json({project: "Create new project to see here"})
        }
    })
})


//get one project
router.get('/get_project/:id', (req, res)=>{
  const project_id = req.params.id;
  db.query("SELECT * FROM projects WHERE id=?;",
  project_id, 
  (err, result)=>{
      if(err){
          res.json({err: err});
        }
      if(result.length >0 ){
          res.json({project: result})
      }
      else{
          res.json({project: "Create new project to see here"})
      }
  })
})



//delete project
router.delete('/delete_project/:id', async (req, res) => {
  const project_id = req.params.id;

  await db.query("SELECT * FROM projects WHERE id=?;",
  project_id, 
  (err, result)=>{
    if(result){
      // console.log(result[0].file_id)
      const id = result[0].file_id
       google.drive({ version: "v3", auth }).files.delete({
        fileId: id,
        });
      console.log("file deleted")
    }
    if(err){
      console.log(err)
    }
  })


  db.query("DELETE FROM `projects` WHERE id=?", project_id, (err) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ msg:true});
    }
  });
});

module.exports = router;