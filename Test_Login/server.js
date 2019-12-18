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


app.use(myParser.urlencoded({ extended: true }));

//Assignment 2 Code
var filename = 'user_data.json' // Set variable filename to reference user_data.json

if (fs.existsSync(filename)) { //check to see if file exists
    stats = fs.statSync(filename);
    // console.log(filename + ' has ' + stats.size + ' characters');
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
   if(req.session.page_views){
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





    // look for files in the "public" folder and listen on port 8080
    app.use(express.static('./public'));
    app.listen(8080, () => console.log(`listening on port 8080`));

//https://stackoverflow.com/questions/27812639/display-alert-message-in-browser-using-node-js
//https://www.webucator.com/tutorial/learn-ajax/intro-ajax-the-nodejs-server.cfm