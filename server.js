// import Express
const express = require("express");
// import file system module (fs)
const fs = require("fs");
// import path
const path = require("path");
const { PassThrough } = require("stream");
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

// get route to send to index.html
app.get("/notes", (req, res) =>
res.sendFile(path.join(__dirname, "Develop/public/notes.html"))
);


// get route which reads the db.json file and sends back parsed JSON data
app.get("api/notes", function(req, res) {
    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        let jsonData = JSON.parse(data);
        console.log(jsonData);
        res.json(jsonData)
    });
});

// Reads the newly added notes from the request body then adds them to the db.json file
const readThenAppendToJson = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeNewNoteToJson(file, parsedData);
        }
    });
};

// Writes data to db.json -> used within the readThenAppendToJson function
const writeNewNoteToJson = (destination, content) => 
fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
err ? console.error(err): console.info(`\nData written to ${destination}`)
);
