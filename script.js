var cities=JSON.parse(localStorage.getItem("cities"));
if(cities===null){
    cities=[];
    saveToLocal();
}

var currentCity=cities[cities.length-1];
var currentDate=moment().format('L'); 


function displayCities(){
    $("#city-container").empty();

    for(var i=0; i<cities.length; i++){
        var newCity=$("<p>")
        newCity.text(cities[i]);
        newCity.addClass("border bg-white p-1 m-0 city");
        newCity.attr("data-city",i);
        var remove=$("<button>");
        remove.addClass("close");
        remove.attr("data-city",i);
        remove.html("<span aria-hidden='true'>&times;</span>");
        newCity.append(remove);
        $("#city-container").append(newCity);
    }

}

displayCities();

function saveToLocal(){
    localStorage.setItem("cities",JSON.stringify(cities));
}

function getLocal(){
    cities=JSON.parse(localStorage.getItem("cities"));
}


function addCity(){
    var cityInput=$("#city-input").val().trim();
    cities.push(cityInput);
    currentCity=cityInput;
    saveToLocal();
    displayCities();
}

function removeCity(cityNumber){
    cities.splice(cityNumber,1);
    saveToLocal();
    displayCities();
}

$("#city-submit").on("click",function(e){
    e.preventDefault;
    addCity();
    displayCities();
});

$("body").on("click",".close",function(){
    removeCity(this.dataset.city);
});
$("body").on("click",".city",function(e){
    e.preventDefault;
    currentCity=cities[this.dataset.city];
    getWeatherInfo();
});




function getWeatherInfo(){
var APIKey = "b6e7eab452f9a9c140d2480dc958d1e3";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+currentCity+"&units=imperial&appid=" + APIKey;

// We then created an AJAX call
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {


  $("#current-city").html(currentCity + " <img src='http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png'>");
  $("#current-temp").text("Temperature: "+Number(response.main.temp).toFixed(1));
  $("#current-hum").text("Humidity: "+response.main.humidity+"%");
  $("#current-wind").text("Wind speed: "+response.wind.speed);

var lat=response.coord.lat;
var lon=response.coord.lon;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+APIKey,
            method: "GET"
          }).then(function(response){
                
                $("#current-uv").text("UV-Index: "+response.current.uvi);
                $("#forecast-row").empty();
                    for(var i=0; i<5; i++){
                        var newContainer=$("<div>");
                        newContainer.addClass("container col bg-primary m-2 white-text");
                        var newDate=$("<h4>");
                        newDate.text(moment().add(i, 'days').format('L')); 
                        newContainer.append(newDate);

                        var newIcon=$("<img>");
                        newIcon.attr("src","http://openweathermap.org/img/wn/"+response.daily[i].weather[0].icon+"@2x.png");
                        newContainer.append(newIcon);

                        var newTemp=$("<h5>");
                        newTemp.text("Temp: "+response.daily[i].temp.day);
                        newContainer.append(newTemp);

                        var newHumidity=$("<h5>");
                        newHumidity.text("Humidity: "+response.daily[i].humidity);
                        newContainer.append(newHumidity); 
                        
                        $("#forecast-row").append(newContainer);
                    }
                    
                
          });





});

}

getWeatherInfo();