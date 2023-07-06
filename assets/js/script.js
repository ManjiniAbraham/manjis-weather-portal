var APIKey="598dc121f9e0e587ba86da32aa3fa923";
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

}
//this is retrieving the data stored in local storage and updating the array searchItems.
function retrievedStoredItems(){
    if (storedSearchItems) {
      searchItems = JSON.parse(storedSearchItems);
    }
    
    console.log(searchItems);
  }