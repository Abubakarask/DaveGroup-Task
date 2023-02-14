const express = require('express')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config({path: "config/config.env"});

const { connectDatabase } = require("./config/database");
connectDatabase();

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Importing Routes
const user = require('./routes/users')

// Using Routes
app.use("/api/v1", user);

app.listen(3000, () => {
    console.log("Server running on port 3000");
})

