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
