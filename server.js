
const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware:to automaticall find static data 

app.use(express.static('public'));



// GET request for reviews
app.get('/api/notes', (req, res) => {
  // Send a message to the client
//   res.send("All notes here")
  fs.readFile("./db/db.json","utf-8", (err, data)=>{
    if(err){
       console.log(err);
       res.status(500).json({
        msg:"oh no!",
        err:err
       })
    }else{
        console.log(data);
        const dataArray =JSON.parse(data);
        res.json(dataArray)
    }
  })
});

// POST request to add a review
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
//   res.send("this will create notes")
  fs.readFile("./db/db.json","utf-8", (err, data)=>{
    if(err){
       console.log(err);
       res.status(500).json({
        msg:"oh no!",
        err:err
       })
    }else{
        // const dataArray =JSON.parse(data);
         let db = fs.readFileSync('db/db.json');
         db = JSON.parse(db);
        const dataArray1 = {
          title: req.body.title,
          text: req.body.text,
          // creating unique id for each note
          id: uuid(),
        };
        db.push(dataArray1);
        fs.writeFile("./db/db.json",JSON.stringify(db, null, 4),(err,data)=>
        {
          if(err){
            console.log(err);
            res.status(500).json({
             msg:"oh no!",
             err:err
            })
                }
          else{
               res.json({
                msg:"Successfully added!"
               })
          }      
        })
        
    }
  })
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete('/api/notes/:id', (req, res) => {
  // reading notes form db.json
  let db = JSON.parse(fs.readFileSync('db/db.json'))
  // removing note with id
  console.log(db)
  let deleteNotes = db.filter(item => item.id !== req.params.id);
  // Rewriting note to db.json
  fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes, null ,4));
  res.json(deleteNotes);
  
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

