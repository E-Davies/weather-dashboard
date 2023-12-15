
let citySearched;

$('#search-button').on('click', function(event){
    event.preventDefault();
    citySearched = $('#search-input').val();
   
    cityQueryURL(citySearched);
})


function cityQueryURL(city){
    
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6b4a10c6ed815160709463b2908e2d4d";

    fetch(queryURL)
    .then(function(response){
        return response.json()
    }).then(function(data){
        console.log(data)
    })
};

function renderWeather(){
    const today = $('#today'); //selecting the section to append a div etc for today's forecast
    const forecast = $('#forecast'); // selecting the section to append a div etc to the rest of the forecat

    
};


