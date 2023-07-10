// import Express
const express = require("express");
// import file system module (fs)
const fs = require("fs");
// import path
const path = require("path");
// helper method to generate unique IDs
const uniqid = require("uniqid");

// Port
const PORT = process.env.PORT || 3001;

// creates new app with express
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Develop/public"));

// get route which sends back to index.html
app.get("/", (req, res) => 
res.sendFile(path.join(__dirname, "Develop/public/index.html"))
);

app.get("api/notes", function(req, res) {
    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        let jsonData = JSON.parse(data);
        console.log(jsonData);
        res.json(jsonData)
    });
});

