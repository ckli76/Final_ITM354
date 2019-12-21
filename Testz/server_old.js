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

var userCardData = users_reg_data.tester.tasks

const EqualNote = userCardData.filter(YESnote => YESnote.note === true)
//Get all data that is type: note

const EqualEvent = userCardData.filter(YESevent => YESevent.event === true)
//Get all data that is type: event

//Checking for today's date
var m = moment();
//npm install moment :)
var string = `${m.toISOString()}`
//Cool stuff, so set m = to moment function which fetches the time right NOW!
//I needed to change the format to one that I could parse and use my own format that matches my JSON
today = new Date(string)
//Make new Date object that I can parse from
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
//GET THAT PARSING
const EqualToday = userCardData.filter(YEStoday => YEStoday.date <= date)
//Filter loop to filter through all the array to get the ones that are either a date that is today or before today 
const sortToday = EqualToday.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1)); 
/*A loop function that goes through all the array to sort lowest to highest... in this case earliest. Thanks W3 schools.
Compares between time*/


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


const EqualYear = userCardData.filter(YESyear => month < YESyear.date)
const sortYear = EqualYear.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualYear)

//This is where we begin to respond to requests in index page
//---------------------------------------------------------------------------------------------------------------------------------------

app.put("/updateTag", function (request, response) {
    testdata = request.body.value; //card data is set as variable
    //console.log(testdata)
});

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
    //console.log("Request Sent!")
});

//This is where we begin to respond to the calendar
//---------------------------------------------------------------------------------------------------------------------------------------
var userCardTasks = users_reg_data.tester.tasks
const TaskEvent = userCardTasks.filter(YESevent => YESevent.event === true)
var userCardWork = users_reg_data.tester.work
const WorkEvent = userCardWork.filter(YESevent => YESevent.event === true)
var userCardAppointments = users_reg_data.tester.appointments
const AppointEvent = userCardAppointments.filter(YESevent => YESevent.event === true)
var userCardOccasion = users_reg_data.tester.occasion
const OccasionEvent = userCardOccasion.filter(YESevent => YESevent.event === true)
var userCardNotes = users_reg_data.tester.notes

var userAllCards = [TaskEvent, WorkEvent, AppointEvent, OccasionEvent]
//console.log(userAllCards)

app.get('/getAllCards', function (req, res) {
    res.send(userAllCards);
    //console.log("Sent all Cards!")
});

// look for files in the "public" folder and listen on port 8080
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//https://stackoverflow.com/questions/27812639/display-alert-message-in-browser-using-node-js
//https://www.webucator.com/tutorial/learn-ajax/intro-ajax-the-nodejs-server.cfm























//I'll have to use a function to redo this

var WorkCard = users_reg_data.tester.work

const EqualNote2 = WorkCard.filter(YESnote => YESnote.note === true)
//Get all data that is type: note

const EqualEvent2 = WorkCard.filter(YESevent => YESevent.event === true)
//Get all data that is type: event

//Checking for today's date
var m = moment();
var string = `${m.toISOString()}`
today = new Date(string)
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const EqualToday2 = WorkCard.filter(YEStoday => YEStoday.date <= date)
const sortToday2 = EqualToday2.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
//Checks which data is equal to today or past it
//console.log(EqualToday)

//Next is Tomorrow: Checking for tomorrow from current date

var m2 = moment();
var a = m2.add(1, "days")
var stringone = `${a.toISOString()}`
thisTmrrw = new Date(stringone)
var tomorrow = thisTmrrw.getFullYear() + '-' + (thisTmrrw.getMonth() + 1) + '-' + thisTmrrw.getDate();
const EqualTomorrow2 = WorkCard.filter(YESTmrrw => date < YESTmrrw.date && YESTmrrw.date === tomorrow)
const sortTomorrow2 = EqualTomorrow2.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualTomorrow)
//Next is Week: Checking for week from current date

var m3 = moment();
var b = m3.add(1, "weeks")
var stringtwo = `${b.toISOString()}`
thisWeek = new Date(stringtwo)
var week = thisWeek.getFullYear() + '-' + (thisWeek.getMonth() + 1) + '-' + thisWeek.getDate();
const EqualWeek2 = WorkCard.filter(YESweek => tomorrow < YESweek.date && YESweek.date <= week)
const sortWeek2 = EqualWeek2.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualWeek)
//Next is Month: Checking for month from current date

var m4 = moment();
var c = m3.add(1, "months")
var stringthree = `${c.toISOString()}`
thisMonth = new Date(stringthree)
var month = thisMonth.getFullYear() + '-' + (thisMonth.getMonth() + 1) + '-' + thisMonth.getDate();
const EqualMonth2 = WorkCard.filter(YESmonth => week < YESmonth.date && YESmonth.date <= month)
const sortMonth2 = EqualMonth2.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(sortMonth)
//Next is Year: Checking for year from current date


const EqualYear2 = WorkCard.filter(YESyear => month < YESyear.date)
const sortYear2 = EqualYear2.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//-------------------------------------------------------------------------------------------------

var AppointCard = users_reg_data.tester.appointments

const EqualNote3 = AppointCard.filter(YESnote => YESnote.note === true)
//Get all data that is type: note

const EqualEvent3 = AppointCard.filter(YESevent => YESevent.event === true)
//Get all data that is type: event

//Checking for today's date
var m = moment();
var string = `${m.toISOString()}`
today = new Date(string)
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const EqualToday3 = AppointCard.filter(YEStoday => YEStoday.date <= date)
const sortToday3 = EqualToday3.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
//Checks which data is equal to today or past it
//console.log(EqualToday)

//Next is Tomorrow: Checking for tomorrow from current date

var m2 = moment();
var a = m2.add(1, "days")
var stringone = `${a.toISOString()}`
thisTmrrw = new Date(stringone)
var tomorrow = thisTmrrw.getFullYear() + '-' + (thisTmrrw.getMonth() + 1) + '-' + thisTmrrw.getDate();
const EqualTomorrow3 = AppointCard.filter(YESTmrrw => date < YESTmrrw.date && YESTmrrw.date === tomorrow)
const sortTomorrow3 = EqualTomorrow3.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualTomorrow)
//Next is Week: Checking for week from current date

var m3 = moment();
var b = m3.add(1, "weeks")
var stringtwo = `${b.toISOString()}`
thisWeek = new Date(stringtwo)
var week = thisWeek.getFullYear() + '-' + (thisWeek.getMonth() + 1) + '-' + thisWeek.getDate();
const EqualWeek3 = AppointCard.filter(YESweek => tomorrow < YESweek.date && YESweek.date <= week)
const sortWeek3 = EqualWeek3.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualWeek)
//Next is Month: Checking for month from current date

var m4 = moment();
var c = m3.add(1, "months")
var stringthree = `${c.toISOString()}`
thisMonth = new Date(stringthree)
var month = thisMonth.getFullYear() + '-' + (thisMonth.getMonth() + 1) + '-' + thisMonth.getDate();
const EqualMonth3 = AppointCard.filter(YESmonth => week < YESmonth.date && YESmonth.date <= month)
const sortMonth3 = EqualMonth3.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(sortMonth)
//Next is Year: Checking for year from current date


const EqualYear3 = AppointCard.filter(YESyear => month < YESyear.date)
const sortYear3 = EqualYear3.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

// ----------------------------------------------------------------------------

var OccasionCard = users_reg_data.tester.occasion

const EqualNote4 = OccasionCard.filter(YESnote => YESnote.note === true)
//Get all data that is type: note

const EqualEvent4 = OccasionCard.filter(YESevent => YESevent.event === true)
//Get all data that is type: event

//Checking for today's date
var m = moment();
var string = `${m.toISOString()}`
today = new Date(string)
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const EqualToday4 = OccasionCard.filter(YEStoday => YEStoday.date <= date)
const sortToday4 = EqualToday4.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
//Checks which data is equal to today or past it
//console.log(EqualToday)

//Next is Tomorrow: Checking for tomorrow from current date

var m2 = moment();
var a = m2.add(1, "days")
var stringone = `${a.toISOString()}`
thisTmrrw = new Date(stringone)
var tomorrow = thisTmrrw.getFullYear() + '-' + (thisTmrrw.getMonth() + 1) + '-' + thisTmrrw.getDate();
const EqualTomorrow4 = OccasionCard.filter(YESTmrrw => date < YESTmrrw.date && YESTmrrw.date === tomorrow)
const sortTomorrow4 = EqualTomorrow4.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualTomorrow)
//Next is Week: Checking for week from current date

var m3 = moment();
var b = m3.add(1, "weeks")
var stringtwo = `${b.toISOString()}`
thisWeek = new Date(stringtwo)
var week = thisWeek.getFullYear() + '-' + (thisWeek.getMonth() + 1) + '-' + thisWeek.getDate();
const EqualWeek4 = OccasionCard.filter(YESweek => tomorrow < YESweek.date && YESweek.date <= week)
const sortWeek4 = EqualWeek4.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualWeek)
//Next is Month: Checking for month from current date

var m4 = moment();
var c = m3.add(1, "months")
var stringthree = `${c.toISOString()}`
thisMonth = new Date(stringthree)
var month = thisMonth.getFullYear() + '-' + (thisMonth.getMonth() + 1) + '-' + thisMonth.getDate();
const EqualMonth4 = OccasionCard.filter(YESmonth => week < YESmonth.date && YESmonth.date <= month)
const sortMonth4 = EqualMonth4.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(sortMonth)
//Next is Year: Checking for year from current date


const EqualYear4 = OccasionCard.filter(YESyear => month < YESyear.date)
const sortYear4 = EqualYear4.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//-------------------------------------------------------------------------------------------------

var NotesCard = users_reg_data.tester.notes

const EqualNote5 = NotesCard.filter(YESnote => YESnote.note === true)
//Get all data that is type: note

const EqualEvent5 = NotesCard.filter(YESevent => YESevent.event === true)
//Get all data that is type: event

//Checking for today's date
var m = moment();
var string = `${m.toISOString()}`
today = new Date(string)
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const EqualToday5 = NotesCard.filter(YEStoday => YEStoday.date <= date)
const sortToday5 = EqualToday5.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
//Checks which data is equal to today or past it
//console.log(EqualToday)

//Next is Tomorrow: Checking for tomorrow from current date

var m2 = moment();
var a = m2.add(1, "days")
var stringone = `${a.toISOString()}`
thisTmrrw = new Date(stringone)
var tomorrow = thisTmrrw.getFullYear() + '-' + (thisTmrrw.getMonth() + 1) + '-' + thisTmrrw.getDate();
const EqualTomorrow5 = NotesCard.filter(YESTmrrw => date < YESTmrrw.date && YESTmrrw.date === tomorrow)
const sortTomorrow5 = EqualTomorrow5.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualTomorrow)
//Next is Week: Checking for week from current date

var m3 = moment();
var b = m3.add(1, "weeks")
var stringtwo = `${b.toISOString()}`
thisWeek = new Date(stringtwo)
var week = thisWeek.getFullYear() + '-' + (thisWeek.getMonth() + 1) + '-' + thisWeek.getDate();
const EqualWeek5 = NotesCard.filter(YESweek => tomorrow < YESweek.date && YESweek.date <= week)
const sortWeek5 = EqualWeek5.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(EqualWeek)
//Next is Month: Checking for month from current date

var m4 = moment();
var c = m3.add(1, "months")
var stringthree = `${c.toISOString()}`
thisMonth = new Date(stringthree)
var month = thisMonth.getFullYear() + '-' + (thisMonth.getMonth() + 1) + '-' + thisMonth.getDate();
const EqualMonth5 = NotesCard.filter(YESmonth => week < YESmonth.date && YESmonth.date <= month)
const sortMonth5 = EqualMonth5.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

//console.log(sortMonth)
//Next is Year: Checking for year from current date


const EqualYear5 = NotesCard.filter(YESyear => month < YESyear.date)
const sortYear5 = EqualYear5.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));

// ----------------------------------------------------------------------------

app.get('/getToday2', function (req, res) {
    res.send(sortToday2);
});

app.get('/getTomorrow2', function (req, res) {
    res.send(sortTomorrow2);
});

app.get('/getWeek2', function (req, res) {
    res.send(sortWeek2);
});

app.get('/getMonth2', function (req, res) {
    res.send(sortMonth2);
});

app.get('/getYear2', function (req, res) {
    res.send(sortYear2);
});

app.get('/getNotes2', function (req, res) {
    res.send(EqualNote2);
    //console.log("El Captain Sent!")
});

//----------------------------------------------------------------------------

app.get('/getToday3', function (req, res) {
    res.send(sortToday3);
});

app.get('/getTomorrow3', function (req, res) {
    res.send(sortTomorrow3);
});

app.get('/getWeek3', function (req, res) {
    res.send(sortWeek3);
});

app.get('/getMonth3', function (req, res) {
    res.send(sortMonth3);
});

app.get('/getYear3', function (req, res) {
    res.send(sortYear3);
});

app.get('/getNotes3', function (req, res) {
    res.send(EqualNote3);
    //console.log("YEE HAW!")
});

//----------------------------------------------------------------------

app.get('/getToday4', function (req, res) {
    res.send(sortToday4);
});

app.get('/getTomorrow4', function (req, res) {
    res.send(sortTomorrow4);
});

app.get('/getWeek4', function (req, res) {
    res.send(sortWeek4);
});

app.get('/getMonth4', function (req, res) {
    res.send(sortMonth4);
});

app.get('/getYear4', function (req, res) {
    res.send(sortYear4);
});

app.get('/getNotes4', function (req, res) {
    res.send(EqualNote4);
    //console.log("BURN DOES BRIDGES!")
});

//----------------------------------------------------------------------------

app.get('/getToday5', function (req, res) {
    res.send(sortToday5);
});

app.get('/getTomorrow5', function (req, res) {
    res.send(sortTomorrow5);
});

app.get('/getWeek5', function (req, res) {
    res.send(sortWeek5);
});

app.get('/getMonth5', function (req, res) {
    res.send(sortMonth5);
});

app.get('/getYear5', function (req, res) {
    res.send(sortYear5);
});

app.get('/getNotes5', function (req, res) {
    res.send(EqualNote5);
    //console.log("POLLY WANTS A CRACKER!")
});

//--------------------------------------------------------------------------------