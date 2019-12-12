// Forked & Adapted from Clement Li: Assingment 2 - server.js (Login & Registration) -->

var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");

app.use(myParser.urlencoded({ extended: true }));
var filename = 'user_datatest.json' // Set variable filename to reference user_data.json

//Assignment 2 Code
var filename = 'user_datatest.json' // Set variable filename to reference user_data.json

if (fs.existsSync(filename)) { //check to see if file exists
    stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats.size + ' characters');
    raw_data = fs.readFileSync(filename, 'utf-8')
    var users_reg_data = JSON.parse(raw_data); // variable users_reg_data = users registration data
    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!');
}

//Card Registration Code - Clement Li

app.post("/card_registered", function (request, response) {
    cardData = request.body; //card data is set as variable
    console.log("Got the card registration request"); //Lets admin know grabbing the registration data was a success
    console.log(request.body); //Lets admin see what was inputted in all the fields
    // process a card request


    username_data = cardData.username;
    title_data = cardData.title;
    event_data = cardData.event;
    note_data = cardData.note
    date_data = cardData.date;
    time_data = cardData.time;
    description_data = cardData.description;
    tag_data = cardData.tag

    //Figure out what username, figure out what tag. Than input the data into the JSON

    
});

 /*This is where the magic happens: We figure out what
  - Cards belong to today, tomorrow, this week, etc.
  - Organize by time
        - The most essential is the date & the time
            - Compare vs a function that records today vs date
            - Compare times for all the arrays
        - Example: Fetching all the same product types
  - Organize by tag
  - Have one for all */


// Make an username input for all the pages for now. 

console.log (users_reg_data.tester.tasks[0])
console.log (users_reg_data.tester.tasks[0].title)
console.log (users_reg_data.tester.tasks[0].date)
console.log (users_reg_data.tester.tasks[0].time)




// look for files in the "public" folder and listen on port 8080
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//https://stackoverflow.com/questions/27812639/display-alert-message-in-browser-using-node-js
//https://www.webucator.com/tutorial/learn-ajax/intro-ajax-the-nodejs-server.cfm