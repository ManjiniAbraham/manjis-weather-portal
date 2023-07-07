
var searchbtn=$('#searchbtn');
var searchItems = [];
var storedSearchItems = localStorage.getItem('searchItems');
var weatherData = []; 

$(function() {

    $("#searchbtn").on("click", searchCity);
  
    retrievedStoredItems();
    createSearchList();
   
 });
  
  //search button funtionality . here i am taking the value from the text input and checking if its already in the array. if yes do not duplicate else add it to the array searchItems.

function searchCity(){
 

    var city= $("#city").val();
    var findCity = searchItems.findIndex(cityName =>cityName.toLowerCase()===city.toLowerCase());
  
    if (findCity===-1){
        searchItems.unshift(city); // Add the search term to the array
    }
    localStorage.setItem('searchItems', JSON.stringify(searchItems));
    createSearchList()
    getApi(city)

}
//this is retrieving the data stored in local storage and updating the array searchItems.
function retrievedStoredItems(){
    if (storedSearchItems) {
      searchItems = JSON.parse(storedSearchItems);
    }
    
    console.log(searchItems);
  }

  //here i am using the array searchItems and displaying the list in the left section as buttons

function createSearchList() {
    var div = $("#searchListContainer"); // The div container where the list will be appended
   
   
    var ul = $("<ul>");// Create the <ul> element
  
    // Loop through each item in the searchItems array
    for (var i = 0; i < searchItems.length; i++) {
      var item = searchItems[i];
  
    // Create a button element for the item
    var button = $("<button>").text(item).addClass("searchlist-btn");
  
    // Create an <li> element for the button
     var li = $("<li>").append(button);    
  
    // Append the <li> element to the <ul> element
      ul.append(li);
    }
    div.empty(); //clearing the div
    div.append(ul); // Append the <ul> element to the div container
  
  }
  //From the json response of the API call, I am storing values of desired fields in a variable and storing them in an array named weatherData.
function getApi(city) {
    
    var queryURL="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey +"&units=metric";

    console.log("My URL: "+ queryURL);
    fetch(queryURL)
      .then(function (response) {
        
        return response.json();
        
      })
      .then(function (data) {
        
        var temperature = data.main.temp;
        var humidity = data.main.humidity;
        var wind = data.wind.speed;
        var place = city;
        var date = dayjs.unix(data.dt).format('MM/DD/YYYY');
        var weatherIcon = data.weather[0].icon;

      
        var weatherInfo = {
            place: place,
            temperature: temperature,
            humidity: humidity,
            wind: wind,            
            date:date ,
            weatherIcon: weatherIcon
        };

          weatherData.push(weatherInfo); // Add the weather information to the array
      
          console.log(weatherData[0]); // Log the weather data array
          displayWeatherInfo();
        })
  .catch(function (error) {
    // Handle any errors that occur during the request
    //console.log('Error:', error);
  });
}
//Here i am trying to append the desired data stored in the weatherData array to display on the page.

function displayWeatherInfo() {
  
  var weather = weatherData[0]; // Get the first item from the weatherData array
  //console.log(weatherData[0]);
  // Update the HTML elements with the weather data
  $("#place").append(weather.place);
  $("#dateValue").append(weather.date);
  $("#iconImage").attr("src", "https://openweathermap.org/img/w/" + weather.weatherIcon + ".png");
  $("#temp").append(weather.temperature);
  $("#wind").append(weather.wind);
  $("#humidity").append(weather.humidity);

  div.empty()

};
