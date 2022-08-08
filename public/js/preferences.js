// import {PythonShell} from 'python-shell';
// Get the objects we need to modify
let chooserestaurant = document.getElementById('preferences');
// Modify the objects we need
chooserestaurant.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();
    link = '/post-restaurant-ajax'

    let pricepreference = document.getElementsByName("price_preference");

    let cuisinepreference = document.getElementsByName("cuisine_preference");
    console.log(pricepreference, cuisinepreference)
    for(i = 0; i < pricepreference.length; i++) {
        if(pricepreference[i].checked){
            choicePrice = pricepreference[i]
        }    
    };
    for(i = 0; i < pricepreference.length; i++) {
        if(cuisinepreference[i].checked){
            choiceCuisine = cuisinepreference[i]
        }    
    };
    console.log(choicePrice.value, choiceCuisine.value)

    data ={
        price:choicePrice.value,
        cuisine: choiceCuisine.value
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", link, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log(xhttp)
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log('input1',xhttp.response)
            updateRow(xhttp.response);
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
 });

 function display_result(data){
    
 }