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
            response.cookie(`${the_username}`, `${request.sessionID}`, { maxAge: 1000000000000000 }).redirect('homepage.html'); //session f
            console.log(`${the_username}` + " has logged on successfully!");
            //msg = `<html><script>if(!alert("Welcome " + ${the_username} + "last login time")) document.location = 'homepage.html'; </script></html>`;
            //response.send(msg);
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
app.post("/logout", function (request, response) {
    logoutData = request.body;
    //console.log(logoutData);
    // Process logout form POST and redirect to logged in page if ok, back to login page if not
    the_username = logoutData.username;
    the_password = logoutData.password;
    //console.log(the_username)
    //console.log(the_password)
    if (typeof users_reg_data[the_username] != 'undefined') { //check if the username exists in the json data
        if (users_reg_data[the_username].password == the_password) {
            response.cookie(`${the_username}`, `${request.sessionID}`, { maxAge: 1000000000000000 }).redirect('homepage.html'); //session f
            console.log(`${the_username}` + " has logged out successfully!");
            //msg = `<html><script>if(!alert("Welcome " + ${the_username} + "last login time")) document.location = 'homepage.html'; </script></html>`;
            //response.send(msg);
            // alert('This is what an alert message looks like.');
        } else {
            msg = `<html><script>if(!alert("No logout submitted")) document.location = 'login.html'; </script></html>`;
            response.send(msg);
        }

    } else {
        msg = `<html><script>if(!alert("logout unsuccessfull")) document.location = 'login.html'; </script></html>`;
        response.send(msg);
    }
}
);
app.post("/login", function (request, response) {
    if (req.session.page_views) {
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
    } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
});

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

    response.redirect('card_index.html');
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

function CardTagSort(TagName) {
    var CardData = users_reg_data.itm352[TagName]
    return CardData;
}

//IN CASE MY GROUP FINISHES THEIR PART I WILL USE THIS!
//In that case I'll have send two data and recieve two
//function CardTagSort(USERNAME, TagName) {
 //   var CardData = users_reg_data[USERNAME][TagName]
 ///   return CardData;
//}

//var CardTagName = CardTagSort('work');

function FindNote(CardTagName) {
    const EqualNote = CardTagName.filter(YESnote => YESnote.note === true)
    return EqualNote;
    //Get all data that is type: note
};

function FindEvent(CardTagName) {
    const EqualEvent = CardTagName.filter(YESevent => YESevent.event === true)
    return EqualEvent;
    //Get all data that is type: event
};

var m = moment();
var string = `${m.toISOString()}`
today = new Date(string)
var date = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

function FindToday(CardTagName) {
    //Checking for today's date
    const EqualToday = CardTagName.filter(YEStoday => YEStoday.date <= date)
    const EqualEvent = EqualToday.filter(YESevent => YESevent.event === true)
    const sortToday = EqualEvent.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
    //Checks which data is equal to today or past it
    //console.log(EqualToday)
    return sortToday;
};

var m2 = moment();
var a = m2.add(1, "days")
var stringone = `${a.toISOString()}`
thisTmrrw = new Date(stringone)
var tomorrow = thisTmrrw.getFullYear() + '-' + ("0" + (thisTmrrw.getMonth() + 1)).slice(-2) + '-' + ("0" + thisTmrrw.getDate()).slice(-2);

function FindTomorrow(CardTagName) {
    //Next is Tomorrow: Checking for tomorrow from current date
    const EqualTomorrow = CardTagName.filter(YESTmrrw => date < YESTmrrw.date && YESTmrrw.date === tomorrow)
    const EqualEvent = EqualTomorrow.filter(YESevent => YESevent.event === true)
    const sortTomorrow = EqualEvent.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
    //console.log(EqualTomorrow)
    return sortTomorrow;
};

var m3 = moment();
var b = m3.add(1, "weeks")
var stringtwo = `${b.toISOString()}`
thisWeek = new Date(stringtwo)
var week = thisWeek.getFullYear() + '-' + ("0" + (thisWeek.getMonth() + 1)).slice(-2) + '-' + ("0" + thisWeek.getDate()).slice(-2);
//console.log(week)

function FindWeek(CardTagName) {
    //Next is Week: Checking for week from current date
    const EqualWeek = CardTagName.filter(YESweek => tomorrow < YESweek.date && YESweek.date <= week)
    const EqualEvent = EqualWeek.filter(YESevent => YESevent.event === true)
    const sortWeek = EqualEvent.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
    //console.log(EqualWeek)
    return sortWeek;
};

var m4 = moment();
var c = m3.add(1, "months")
var stringthree = `${c.toISOString()}`
thisMonth = new Date(stringthree)
var month = thisMonth.getFullYear() + '-' + ("0" + (thisMonth.getMonth() + 1)).slice(-2) + '-' + ("0" + thisMonth.getDate()).slice(-2);
//console.log(month)

function FindMonth(CardTagName) {
    //Next is Month: Checking for month from current date
    const EqualMonth = CardTagName.filter(YESmonth => week < YESmonth.date && YESmonth.date <= month)
    const EqualEvent = EqualMonth.filter(YESevent => YESevent.event === true)
    const sortMonth = EqualEvent.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
    //console.log(sortMonth)
    return sortMonth;
};

/*var m5 = moment();
var d = m5.add(1, "years")
var stringthree = `${d.toISOString()}`
thisYear = new Date(stringthree)
var year = thisYear.getFullYear() + '-' + ("0" + (thisYear.getMonth() + 1)).slice(-2) + '-' + ("0" + thisYear.getDate()).slice(-2); */

function FindYear(CardTagName) {
    //Next is Year: Checking for year from current date
    const EqualYear = CardTagName.filter(YESyear => month < YESyear.date)
    const EqualEvent = EqualYear.filter(YESevent => YESevent.event === true)
    const sortYear = EqualEvent.sort((a, b) => (a.date > b.date || a.time > b.time ? 1 : -1));
    return sortYear;
};

//This is where we begin to respond to requests in index page
//---------------------------------------------------------------------------------------------------------------------------------------
//console.log(FindYear(CardTagSort('tasks')))

app.put('/getToday', function (req, res) {
    //var CardTagName = CardTagSort(teatdata);
    //console.log(req.body.value + 'today')
    var response = FindToday(CardTagSort(req.body.value));
    res.send(response);
});

app.put('/getTomorrow', function (req, res) {
    //console.log(req.body.value + 'tomorrow')
    var response = FindTomorrow(CardTagSort(req.body.value));
    res.send(response);
});

app.put('/getWeek', function (req, res) {
    //console.log(req.body.value + 'week')
    var response = FindWeek(CardTagSort(req.body.value));
    res.send(response);
});

app.put('/getMonth', function (req, res) {
    //console.log(req.body.value + 'month')
    var response = FindMonth(CardTagSort(req.body.value));
    //console.log(response);
    res.send(response);
});

app.put('/getYear', function (req, res) {
    //console.log(req.body.value + 'year')
    var response = FindYear(CardTagSort(req.body.value));
    //console.log(response);
    res.send(response);
});

app.put('/getNotes', function (req, res) {
    //console.log(req.body.value + 'notes')
    //console.log("Request Sent!")
    var response = FindNote(CardTagSort(req.body.value));
    res.send(response);
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

//EDITING FUNCTION PART

app.put('/card_change/:title', function (req, res) {
    var title = req.params.title;
    var body = req.body;
    console.log(body)
    /*
    var found = false;

    products.forEach(function(product, index) {
        if (!found && product.id === Number(id)) {
            product.name = newName;
        }
    });
    */
    res.send('Succesfully updated product!');
});

// look for files in the "public" folder and listen on port 8080
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//https://stackoverflow.com/questions/27812639/display-alert-message-in-browser-using-node-js
//https://www.webucator.com/tutorial/learn-ajax/intro-ajax-the-nodejs-server.cfm



//Get the tag data through the get request.

//Ex. Press the button and the hidden string value is sent.

//Once I get the hidden string value... I can use the string value inside the function. So the function will be outside the request.