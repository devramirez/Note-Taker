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

// get route which sends back to notes.html
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
            console.error(err);
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

// Post route -> receives a new note, saves it to the request body then adds it to db.json file then returns the new note
app.post("/api/notes", (req, res) => {
    const {title, text } = req.body;
    if (title && text) {
        const newNote = {
            title: title,
            text: text,
            id: uniqid(),
        };
        
        readThenAppendToJson(newNote, "Develop/db/db.json");

        const response = {
            status: "success",
            body: newNote,
        };

        res.json(response);
    } else {
        res.json("Error in posting new note")
    }
});

// Delete route -> reads the db.json file, uses the json objects uniqids to match the object to be deleted, removes that object from the db.json, then re-writes the db.json file
app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    let parsedData;
    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {
            parsedData = JSON.parse(data);
            const filterData = parsedData.filter((note) => note.id !== id);
            writeNewNoteToJson("Develop/db/db.json", filterData);
        }
    });
    res.send(`Deleted note with ${req.params.id}`);
});

// app.listen method is used to initialize our local server
app.listen(PORT, () => 
    console.log(`App is listening at http://localhost:${PORT} `)
);