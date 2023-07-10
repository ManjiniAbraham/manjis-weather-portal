  
var APIKey="598dc121f9e0e587ba86da32aa3fa923";
var searchbtn=$('#searchbtn');
var searchItems = localStorage.searchItems ? JSON.parse(localStorage.searchItems) : [];
var weatherData = []; // Array to store weather data
var x;
 

$(function() {

  $("#searchbtn").on("click", searchCity);

  renderSearchHistory();
  $("button[class*='search-btn']").on("click", function() {
    var city = $(this).text();  
    getWeather(city);
  });
});



//search button funtionality . here i am taking the value from the text input and checking if its already in the array. if yes do not duplicate else add it to the array searchItems.
function searchCity(){

  var city= $.trim($("#city").val());
  var findCity = searchItems.findIndex(cityName =>cityName.toLowerCase()===city.toLowerCase());

  if (findCity===-1 && city.length > 0){
      searchItems.unshift(city); // Add the search term to the array
  }

  localStorage.setItem('searchItems', JSON.stringify(searchItems));

  renderSearchHistory();

  getWeather(city);
 
}


//here i am using the array searchItems and displaying the list in the left section as buttons

function renderSearchHistory() {

  var div = $("#searchListContainer"); // The div container where the list will be appended
 
  var ul = $("<ul>");// Create the <ul> element

  // Loop through each item in the searchItems array
  for (var i = 0; i < searchItems.length; i++) {
    var item = searchItems[i];

    // Create a button element for the item
    var button = $("<button>").text(item).addClass("search-btn");

    // Create an <li> element for the button
    var li = $("<li>").append(button);    

    // Append the <li> element to the <ul> element
      ul.append(li);
  }

  if (searchItems.length > 0){
    div.empty(); //clearing the div
    div.append(ul); // Append the <ul> element to the div container
  }
 
}


//From the json response of the API call, I am storing values of desired fields in a variable and storing them in an array named weatherData.
function getWeather(city) {
    
    if ($.trim(city)== "") {
      return;
    }
    var weatherAPI="http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey +"&units=imperial";
    

    var findCity = weatherData.findIndex(index =>index.place.toLowerCase() === city.toLowerCase());
    
    fetch(weatherAPI)
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
        var cityLat=data.coord.lat;
        var cityLon= data.coord.lon;
        var forecastWeatherData = [];
        var weatherInfo;
        
        var forecastAPI= "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&" + "&lat=" + cityLat +"&lon=" + cityLon +"&appid=" + APIKey;
        
        fetch(forecastAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            var forecastList = data.list;
            console.log(forecastList);
            // Loop through the forecast list
            for (let i = 4; i < forecastList.length; i += 8) {
              forecast = forecastList[i];
              var temp = forecast.main.temp;
              var humidity = forecast.main.humidity;
              var wind = forecast.wind.speed;
              var place = data.city.name;
              var date = dayjs.unix(forecast.dt).format('MM/DD/YYYY');
              var weatherIcon = forecast.weather[0].icon;
              var forecastWeatherInfo = {
                  date: date,
                  place: place,
                  humidity: humidity,
                  wind: wind,
                  temperature: temp,
                  weatherIcon: weatherIcon
              };
              forecastWeatherData.push(forecastWeatherInfo);
            }
            
        })
        .then(function(){
          weatherInfo = {
            place: place,
            temperature: temperature,
            humidity: humidity,
            wind: wind,            
            date:date ,
            weatherIcon: weatherIcon,
            cityLat:cityLat,
            cityLon:cityLon,
            forecast: forecastWeatherData
          };
          
          
          // if the city does not exist in the forecast, add the data, else update it
          if (findCity === -1){
            weatherData.push(weatherInfo); // Add the weather information to the array
          } else {
            weatherData[findCity] = weatherInfo;
          }
          //console.table(weatherData);
          displayWeatherInfo(city);
        })           
        .catch(function (error) {
          console.log('Error:', error);
        });
        
        localStorage.setItem('weatherData', JSON.stringify(weatherData));
        
        
      })
      .catch(function (error) {
        // Handle any errors that occur during the request
        console.log('Error:', error);
      });
}


//Here i am trying to append the desired data stored in the weatherData array to display on the page.
function displayWeatherInfo(city) {

  var findCity = weatherData.findIndex(index =>index.place.toLowerCase() === city.toLowerCase());
  var weatherDiv = $("#weatherInfo");
  var forecastDiv = $("#forecastInfo");
  
  if (findCity >= 0) {
    
    var displayCity = weatherData[findCity];
    var forecast = displayCity.forecast;

    weatherDiv.empty();
    var htmlstring = "";
    htmlstring += "<div class='card white darken-1'>";
    htmlstring += "<div class='card-content rgba(0,0,0,0.87)''>";
    htmlstring += "<span class='card-title'><h4>"+displayCity.place +" (" + displayCity.date +")</h4>";
    htmlstring += "<img id='icon' class='responsive-img'"+" src='https://openweathermap.org/img/w/" + displayCity.weatherIcon + ".png' alt='Weather Icon'>";
    htmlstring += "</span>";
    htmlstring += "<ul>";
    htmlstring += "<li>Temp: "+displayCity.temperature +" &#8457;</li>";
    htmlstring += "<li>Wind: "+displayCity.wind +" MPH</li>";
    htmlstring += "<li>Humidity: "+displayCity.humidity +" %</li>";
    htmlstring += "</ul>";
    htmlstring += "</div>";
    htmlstring += "</div>";
    weatherDiv.append(htmlstring);

    forecastDiv.empty();
    htmlstring = "";
    htmlstring += "<div class='col s12 m12'><h5>5 Day Weather Forecast</h5></div>";
    forecast.forEach( weather => {
      
      htmlstring += "<div class='col m5ths s6'>";
      htmlstring += "<div class='card blue-grey lighten-1'>";
      htmlstring += "<div class='card-content white-text'>";
      htmlstring += "<span class='card-title'><b>"+weather.date+"</b>";
      htmlstring += "<img id='icon' class='reponsive-img'"+" src='https://openweathermap.org/img/w/" + weather.weatherIcon + ".png' alt='Weather Icon'>";
      htmlstring += "</span>";
      htmlstring += "<ul>";
      htmlstring += "<li>Temp: "+weather.temperature+" &#8457;</li>";
      htmlstring += "<li>Wind: "+weather.wind+" MPH</li>";
      htmlstring += "<li>Humidity: "+weather.humidity+" %</li>";
      htmlstring += "</ul>";
      htmlstring += "</div>";         
      htmlstring += "</div>";
      htmlstring += "</div>";
    });
    
    forecastDiv.append(htmlstring);
  }
};
