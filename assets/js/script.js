var searchbtn=$('#searchbtn');
var searchItems = [];
var storedSearchItems = localStorage.getItem('searchItems');

$(function() {

    $("#searchbtn").on("click", searchCity);
  
    retrievedStoredItems();
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
  