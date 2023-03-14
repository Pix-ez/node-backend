const stream = require("stream");
const db = require('../database');
const {Router} = require('express');
const router = Router();
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");


const upload = multer();

const KEYFILEPATH = path.join(__dirname, '../credentials.json');
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const uploadFile = async (fileObject, pname, uid) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await google.drive({ version: "v3", auth }).files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: ["1Ek-OAsO7fVqbZIewKL7Nj0to57wntD2N"],
    },
    fields: "id,name",
  });
  // console.log(`Uploaded file ${data.name} ${data.id}`);
  db.query('UPDATE projects SET file_name = ?, file_id = ? WHERE user_id = ? AND name = ?', [data.name,data.id, uid, pname])
};

router.post("/upload", upload.any(), async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.files);
    const { body, files  } = req;
    const pname= body.pname;
    const uid = body.uid;
   

    for (let f = 0; f < files.length; f += 1) {
      await uploadFile(files[f],pname,uid);
    }

    // console.log(body.pname);
    // console.log(data)
    res.json({msg: ok});
  } catch (f) {
    res.send(f.message);
  }
});


router.post('/save', async (req, res)=>{
  const note =req.body.note;
  const name = req.body.name;

  db.query('UPDATE projects SET notes= ? WHERE  name = ?',
  [note, name], (err)=>{
    if(err){
      console.log(err)
    }else{
      console.log("saved")
      res.json({status:"saved"})
    }
  })
})

// router.get('/save', async (req, res)=>{
 

//   db.query('UPDATE projects SET notes= ? WHERE  name = ?',
//   [note, name], (err)=>{
//     if(err){
//       console.log(err)
//     }else{
//       console.log("saved")
//       res.json({status:"saved"})
//     }
//   })
// })

module.exports = router;