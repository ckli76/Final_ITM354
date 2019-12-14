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
    //console.log(users_reg_data);
    //console.log(raw_data)
} else {
    console.log(filename + ' does not exist!');
}


var cool_data = users_reg_data.tester.tasks

//let test = [];

//test.push()
//This works, after suffering through hours, this works. YEP YEAHHHHHHHHHHHHHHHHHHHHHH
const test = cool_data.filter(oof => oof.event === false)

//var yay = JSON.stringify(test)
console.log({test: test})
//console.log({ test: test })
//const interest = cool_data.filter(wow =>  wow.date >= "")


//https://tecadmin.net/get-current-date-time-javascript/
/*var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
console.log(date)

var week = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+7);
console.log(week)

var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
console.log(time) */

/* app.delete('/products/:id', function(req, res) {
    var id = req.params.id;
 
    var found = false;
 
    products.forEach(function(product, index) {
        if (!found && product.id === Number(id)) {
            products.splice(index, 1);
        }
    }); 
 
    res.send('Successfully deleted product!');
}); */

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

//console.log(users_reg_data.tester.tasks[0])
//console.log(users_reg_data.tester.tasks[0].title)
//console.log(users_reg_data.tester.tasks.length)


/*for (var i = 0; i < users_reg_data.tester.tasks.length; i++) {
    var test = users_reg_data.tester.tasks[i];
    var entries = Object.entries(test)
    //console.log(test.date)
    //myFunction(test.time)
    //myFunction(test.time)
    var array_test = [test.date]
    var array_testtwo = [test.time]
} */

// look for files in the "public" folder and listen on port 8080
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//https://stackoverflow.com/questions/27812639/display-alert-message-in-browser-using-node-js
//https://www.webucator.com/tutorial/learn-ajax/intro-ajax-the-nodejs-server.cfm