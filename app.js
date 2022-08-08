/*
SETUP (for a simple web app)
*/
const path = require('path');
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 1306;                 // Set a port number at the top so it's easy to change in the future

var bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars'); // Import express-handlebars
const {PythonShell} =require('python-shell');

// Database Connector
const restaurantData = require('./data/restaurantdata.json')

const { stringify } = require('querystring');
let fs = require('fs');
const { Console } = require('console');


app.engine('.hbs', engine({ 
  extname: ".hbs", defaultLayout: "main"}));  
app.set('view engine', '.hbs');


app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({ extended: true }));

function socket_connection(list_filter, res){
    let len = list_filter.length
    console.log(list_filter)
    console.log('SOCKET CONNECTION FUNCTION')
    let utf8Encode = new TextEncoder();
    const net = require('node:net');
    const client = net.connect({ port: 1300 }, function() {
    // 'connect' listener.
    console.log('connected to server!');
    });
    encodedlen=utf8Encode.encode(len.toString())
    console.log(encodedlen)
    client.write(encodedlen);
    client.on('data', function(data) {
        let randomnum=data.toString()
        console.log('random num',randomnum);
        let selected_rest=list_filter[randomnum]
        // console.log('before dump into JSON', selected_rest)


        console.log('selected:', selected_rest)
        res.render('selected', {selected: selected_rest});
    })
     client.on('end', function() { 
        console.log('disconnected from server');
     });

    return 
}

async function async_socket(list_filter, res){
    let result = await socket_connection(list_filter, res);
}

/*
    ROUTES
*/

// Home Page
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.render('index')      // This function literally sends the string "The server is running!" to the computer
    });                                         // requesting the web site.

// Help Page
app.get('/help', (req, res) => {
    res.render('help')
})

// Exploration Page
app.get('/explore', (req, res) => {
    // console.log(restaurantData)
    res.render('explore', {data: restaurantData})
    })

// Random Restaurant Generator Page
app.get('/generator', function(req, res)
{   
    let data = req.query
    console.log(data)
    let choicePrice = data.price_preference
    let choiceCuisine = data.cuisine_preference
    let list_filter = []

    console.log('choice cuisine:', choiceCuisine,'choice price:', choicePrice)
    // Load the page
    if (choiceCuisine === undefined && choicePrice === undefined)
    {
        res.render('generator')
    }
    // No preferences
    else if(choicePrice === '0' && choicePrice === '0'){
        async_socket(restaurantData, res)

    }
    // If there is a filter set for cuisine choice
    else if (choicePrice === '0')
    {   
        console.log('test choice price=0', choicePrice)
        for (let i = 0; i < restaurantData.length; i++) {
            if (restaurantData[i].Cuisine.includes(choiceCuisine)){
                list_filter.push(restaurantData[i])
            }
          } 
        async_socket(list_filter, res)

    }
    // If there is only a filter set for price range
    else if (choiceCuisine === '0')
    {   console.log('test choice=0')
        for (let i = 0; i < restaurantData.length; i++) {
            if (restaurantData[i].Price_Range == choicePrice){
                list_filter.push(restaurantData[i])
            }
          } 
        async_socket(list_filter, res)
       
    }
    // If there is a filter set for cuisine and price range
    else 
    {
        console.log('two filters')
        for (let i = 0; i < restaurantData.length; i++) {
            if (restaurantData[i].Cuisine.includes(choiceCuisine)&&restaurantData[i].Price_Range ===choicePrice){
                list_filter.push(restaurantData[i])
            }
          } 

        async_socket(list_filter, res)
    }
});










/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
