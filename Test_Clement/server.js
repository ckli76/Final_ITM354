/*
- Index need to be able to sort by tag
- Delete the cards from JSON
(might have to make a delete page if necessary)
- Make new cards into JSON (index page working at least
- Calendar must at least load the data 
(No need worry about the delete or new cards)
(We're going to force the users to delete or make new cards in the index)
*/

var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
// Forked & Adapted from Clement Li: Assingment 2 - server.js (Login & Registration) -->

var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var session = require('express-session');
var moment = require("moment"); //Need this in the other server.

app.use(session({ secret: "ITM352 rocks!" }));
app.use(myParser.urlencoded({ extended: true }));

//Assignment 2 Code
var filename = 'user_data.json' // Set variable filename to reference user_data.json

if (fs.existsSync(filename)) { //check to see if file exists
    stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats.size + ' characters');
    raw_data = fs.readFileSync(filename, 'utf-8')
    var users_reg_data = JSON.parse(raw_data); // variable users_reg_data = users registration data
    //console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!');
}

app.post("/login", function (request, response) {
    loginData = request.body;
    //console.log(loginData);
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    the_username = loginData.username;
    the_password = loginData.password;
    //console.log(the_username)
    //console.log(the_password)
    if (typeof users_reg_data[the_username] != 'undefined') { //check if the username exists in the json data
        if (users_reg_data[the_username].password == the_password) {
            console.log(`${the_username}` + " has logged on successfully!");
            msg = `<html><script>if(!alert("Welcome " + ${the_username})) document.location = 'homepage.html'; </script></html>`;
            response.send(msg);
            // alert('This is what an alert message looks like.');
        } else {
            msg = `<html><script>if(!alert("invalid password")) document.location = 'login.html'; </script></html>`;
            response.send(msg);
        }

    } else {
        msg = `<html><script>if(!alert("username not found")) document.location = 'login.html'; </script></html>`;
        response.send(msg);
    }
}
);

app.post("/register", function (request, response) {
    regData = request.body;
    console.log("Got the registration request");
    console.log(request.body);
    // process a simple register form

    validerrors = false;

    username_input = regData.username.toLowerCase();
    password_input = regData.password;
    REpassword_input = regData.repeat_password;
    email_input = regData.email;

    //Validate username
    var letters = /^[0-9a-zA-Z]+$/;

    if (typeof users_reg_data[username_input] != 'undefined') {
        validerrors = true
    };
    if (username_input.length < 1 && username_input.length > -1) {
        validerrors = true
    };
    if (username_input.length > 0 && username_input.length < 4) {
        validerrors = true
    };
    if (username_input.length > 15) {
        validerrors = true
    };
    if (username_input.match(letters)) { }
    else {
        validerrors = true
    };

    //Validate Password

    if (password_input.length < 1 && password_input.length > -1) {
        validerrors = true
    };
    if (password_input.length > 0 && password_input.length < 5) {
        validerrors = true
    };

    //Validate Re-Entered Password

    if (REpassword_input.length < 1 && REpassword_input.length > -1) {
        validerrors = true
    };
    if (password_input != REpassword_input) {
        validerrors = true
    };

    //Validate Email

    var email_letters = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email_input.length < 1 && email_input.length > -1) {
        validerrors = true
    };

    if (email_input.match(email_letters)) { }
    else { validerrors = true };

    username_input = regData.username;

    if (validerrors == false) {
        users_reg_data[username_input] = {};
        users_reg_data[username_input].name = username_input;
        users_reg_data[username_input].password = regData.password;
        users_reg_data[username_input].email = regData.email;

        console.log(username_input)

        var output_data = JSON.stringify(users_reg_data);
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));

        console.log(output_data)
        response.cookie(`${username_input}`, `${request.sessionID}`, { maxAge: 1000000000000000 }).redirect('homepage.html'); //session f
        msg = `<html><script>if(!alert("Welcome" + ${username_input}) document.location = 'homepage.html'; </script></html>`;
        response.send(msg); //to send an alert and redirect after registration
        //response.send(`${username_input} registered!`);
    }
    else {
        response.redirect('registration.html');
    }
});
//Card Registration Code - Clement Li

app.post("/card_registered", function (request, response) {
    cardData = request.body; //card data is set as variable
    console.log("Got the card registration request"); //Lets admin know grabbing the registration data was a success
    //console.log(request.body); //Lets admin see what was inputted in all the fields
    // process a card request

    username_data = cardData.username;
    title_data = cardData.title;
    event_data = JSON.parse(cardData.event);
    note_data = JSON.parse(cardData.note);
    date_data = cardData.date;
    time_data = cardData.time;
    description_data = cardData.description;
    tag_data = cardData.tag
    //Figure out what username, figure out what tag. Than input the data into the JSON

    var NewcardData = {
        "title": title_data,
        "event": event_data,
        "note": note_data,
        "date": date_data,
        "time": time_data,
        "description": description_data
    }

    if (typeof users_reg_data[username_data][tag_data] != 'undefined') {
        users_reg_data[username_data][tag_data].push(NewcardData)
        console.log(users_reg_data[username_data][tag_data])
        console.log("Data has been proccessed!")
    };

    var writeFile = JSON.stringify(users_reg_data);
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    response.redirect('/index.html');
});


//---------------------------------------------------------------------------------------------------------------------------------------
/*This is where the magic happens: We figure out what
 - Cards belong to today, tomorrow, this week, etc.
 - Organize by time
       - The most essential is the date & the time
           - Compare vs a function that records today vs date
           - Compare times for all the arrays
       - Example: Fetching all the same product types
 - Organize by tag
 */


// Make an username input for all the pages for now. 

//console.log(users_reg_data.tester.tasks[1])
//console.log(users_reg_data.tester.tasks[0].title)
//console.log(users_reg_data.tester.tasks.length)

app.put("/updateTag", function (request, response) {
    testdata = request.body; //card data is set as variable
    console.log(testdata);
});


var userCardData = users_reg_data.tester.tasks


const EqualNote = userCardData.filter(YESnote => YESnote.note === true)
//Get all data that is type: note

const EqualEvent = userCardData.filter(YESevent => YESevent.event === true)
//Get all data that is type: event

//Checking for today's date

var m = moment();
var string = `${m.toISOString()}`
today = new Date(string)
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const EqualToday = userCardData.filter(YEStoday => YEStoday.date <= date)
const sortToday = EqualToday.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
//Checks which data is equal to today or past it
//console.log(EqualToday)

//Next is Tomorrow: Checking for tomorrow from current date

var m2 = moment();
var a = m2.add(1, "days")
var stringone = `${a.toISOString()}`
thisTmrrw = new Date(stringone)
var tomorrow = thisTmrrw.getFullYear() + '-' + (thisTmrrw.getMonth() + 1) + '-' + thisTmrrw.getDate();
const EqualTomorrow = userCardData.filter(YESTmrrw => date < YESTmrrw.date && YESTmrrw.date === tomorrow)
const sortTomorrow = EqualTomorrow.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualTomorrow)
//Next is Week: Checking for week from current date

var m3 = moment();
var b = m3.add(1, "weeks")
var stringtwo = `${b.toISOString()}`
thisWeek = new Date(stringtwo)
var week = thisWeek.getFullYear() + '-' + (thisWeek.getMonth() + 1) + '-' + thisWeek.getDate();
const EqualWeek = userCardData.filter(YESweek => tomorrow < YESweek.date && YESweek.date <= week)
const sortWeek = EqualWeek.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualWeek)
//Next is Month: Checking for month from current date

var m4 = moment();
var c = m3.add(1, "months")
var stringthree = `${c.toISOString()}`
thisMonth = new Date(stringthree)
var month = thisMonth.getFullYear() + '-' + (thisMonth.getMonth() + 1) + '-' + thisMonth.getDate();
const EqualMonth = userCardData.filter(YESmonth => week < YESmonth.date && YESmonth.date <= month)
const sortMonth = EqualMonth.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(sortMonth)
//Next is Year: Checking for year from current date

/*var m5 = moment();
var d = m4.add(1, "years")
var stringfour = `${d.toISOString()}`
thisYear = new Date(stringfour)
var year = thisYear.getFullYear()+'-'+(thisYear.getMonth()+1)+'-'+thisYear.getDate();*/
const EqualYear = userCardData.filter(YESyear => month < YESyear.date)
const sortYear = EqualYear.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualYear)

//This is where we begin to respond to requests that the client wants
//---------------------------------------------------------------------------------------------------------------------------------------

app.get('/getToday', function (req, res) {
    res.send(sortToday);
});

app.get('/getTomorrow', function (req, res) {
    res.send(sortTomorrow);
});

app.get('/getWeek', function (req, res) {
    res.send(sortWeek);
});

app.get('/getMonth', function (req, res) {
    res.send(sortMonth);
});

app.get('/getYear', function (req, res) {
    res.send(sortYear);
});

app.get('/getNotes', function (req, res) {
    res.send(EqualNote);
    console.log("Request Sent!")
});

var userCardTasks = users_reg_data.tester.tasks
const TaskEvent = userCardTasks.filter(YESevent => YESevent.event === true)
var userCardWork = users_reg_data.tester.work
const WorkEvent = userCardWork.filter(YESevent => YESevent.event === true)
var userCardAppointments = users_reg_data.tester.appointments
const AppointEvent = userCardAppointments.filter(YESevent => YESevent.event === true)
var userCardOccasion = users_reg_data.tester.occasion
const OccasionEvent = userCardOccasion.filter(YESevent => YESevent.event === true)

var userAllCards = [TaskEvent, WorkEvent, AppointEvent, OccasionEvent]
//console.log(userAllCards)

app.get('/getAllCards', function (req, res) {
    res.send(userAllCards);
    console.log("Sent all Cards!")
});

// look for files in the "public" folder and listen on port 8080
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//https://stackoverflow.com/questions/27812639/display-alert-message-in-browser-using-node-js
//https://www.webucator.com/tutorial/learn-ajax/intro-ajax-the-nodejs-server.cfm
