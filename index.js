
const express = require("express")
const cors = require("cors")
const mysql = require('mysql2')
const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'saikumar2005',
    database : 'todo'
})

db.connect((err) => {
    if (err) {
        console.log("Error while conneceting to db")
        return 
    }
    console.log("Succesfully connected to database ✅✅")
})
app.get("/", (req, res) => {
    console.log("Default route");
    db.query('select * from todoItems', (err, result) => {
        if (err) {
            console.log("error occured", err)
            return
        }
        console.log("Data: ", result)
        res.send(result)
    })
})

app.post('/add-item', (req, res) => {
    console.log(req.body);
    
    db.query(`insert into todoItems (itemDescription) values ('${req.body.text}')`, (err, results) => {
        if (err) {
            console.log("error occured", err)
            return
        }
        console.log("Created succesfully")
    })
    res.send("Added Succesfully")
})

app.put('/edit-item' , (req, res) => {
    console.log('Line 50: ', req.body)
    db.query(`update todoItems set itemDescription= "${req.body.itemDescription}" where ID = ${req.body.ID};`, (err, results) => {
        if (err) {
            console.log("error occured", err)
            return
        }
        console.log("Created succesfully")
    })
  res.send("Success")
})
app.delete('/delete-item/:id', (req, res) => {
    const id = req.params.id;
    db.query(`DELETE FROM todoItems WHERE ID = ?`, [id], (err, results) => {
        if (err) {
            console.log("Error occured", err);
            return res.status(500).send("Error deleting item");
        }
        console.log("Deleted successfully");
        res.send("Deleted successfully");
    });
});



app.listen(3000, () => {
    console.log("server is runnig at http//:localhost:3000")
})