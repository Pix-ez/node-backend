const {Router, response} = require('express');
const router = Router();
const csv = require('fast-csv');
const fs = require('fs');
const db = require('../database');
const path = require("path");
const { google } = require("googleapis"); 

const KEYFILEPATH = path.join(__dirname, '../credentials.json');
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});




//original
// router.get("/create/:id", async(req, res) => {
//   const project_id = req.params.id;

//   await db.query("SELECT * FROM projects WHERE id=?;",
//   project_id, 
//   (err, result)=>{
//     if(result){
//       // console.log(result[0].file_id)
//       const id = result[0].file_id
//        // Get the file from Google Drive using the file ID
//       const file = google.drive({ version: "v3", auth }).files.get({
//       fileId: id,
//       alt: 'media',
//       }, {
//       responseType: 'stream',
//       });
    
//     }
//     if(err){
//       console.log(err)
//     }
//   })
//     let data = [];
//     // read the csv file
//     fs.createReadStream("../backend/uploads/temperatures.csv")
//       .pipe(csv.parse({ headers: true }))
//       .on("data", row => data.push(row))
//       .on("end", () => {
//         res.json(data);
//       });
//   });
 

router.get("/create/:id", async(req, res) => {
  const project_id = req.params.id;
  let id =""
  let name = ""
  let desc = ""

  // const result = await db.query("SELECT * FROM projects WHERE id=?;", project_id);

  // console.log(result[0])

  await db.query("SELECT * FROM projects WHERE id=?;",
  project_id, 
  async (err, result)=>{
    if(result){
      // console.log(result[0].file_id)
      id = result[0].file_id
      name = result[0].name
      desc = result[0].description
      }

  console.log(id , name , desc)
  try {
     // Get the file from Google Drive using the file ID
     const response = await google.drive({ version: "v3", auth }).files.get({
      fileId: id,
      alt: 'media'
    }, {
      responseType: 'stream',
    });
     console.log(response.data)

     let data = [];
      
      // parse the csv file
      response.data
        .pipe(csv.parse({ headers: true }))
        .on("data", row => data.push(row))
        .on("end", () => {
          res.json({data:data, name:name , desc:desc});
        });
   

  } catch (error) {
    
  }
      
})

});











module.exports = router;