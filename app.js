const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();

app.use(
    bodyParser.json(
        { limit: '30mb', 
        type: 'application/json'}
    )
);

app.get("/helloFriend", (req, res) => {
    res.send("Hallo Freund");
});

app.listen(process.env.PORT, () => {
    console.log(`Application running on port ${process.env.PORT}`)
});
    
    