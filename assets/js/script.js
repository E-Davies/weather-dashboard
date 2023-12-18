
const forecast = $('#forecast'); // selecting the section to append a div etc to the rest of the forecast

$('#search-button').on('click', function(event){
    event.preventDefault();
    let citySearched = $('#search-input').val();
    cityQueryURL(citySearched);
});


function cityQueryURL(city){
    
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=6b4a10c6ed815160709463b2908e2d4d";

    fetch(queryURL)
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);

        let city = data.city.name;
        let apiDate = data.list[0].dt_txt.substr(0, 10); //.substr(0, 10) keeps the first 10 characters of the string so from this: 2023-12-18 12:00:00 to this: 2023-12-18
        let properDate = dayjs(`${apiDate}`, `YYYY-MM-DD`).format(`(DD/MM/YYYY)`); // converts the api date to a different format
        let weatherIcon = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
        let wind = (data.list[0].wind.speed * 2.237).toFixed(2); //the api wind speed is meters per sec (mps) so to get MPH * 2.237
        let temp = data.list[0].main.temp;
        let humidity = data.list[0].main.humidity;

        renderWeather(city, properDate, weatherIcon, temp, wind, humidity)
    });
};

function renderWeather(city, properDate, weatherIcon, temp, wind, humidity){
    const today = $('#today'); //selecting the section to append a div etc for today's forecast
    today.css('border', '1px solid black');

    const newH2 = $('<h2>');
    newH2.attr('id', 'todays-date');
    newH2.text(`${city} ${properDate}`);

    const newImg = $('<img>');
    newImg.attr('src', weatherIcon);
    newH2.append(newImg);

    const newTemp = $('<p>');
    newTemp.attr('id', 'temp');
    newTemp.text(`Temp: ${temp}°c`);

    const newWind = $('<p>');
    newWind.attr('id', 'wind');
    newWind.text(`Wind: ${wind} MPH`);

    const newHumidity = $('<p>');
    newHumidity.attr('id', 'humidity');
    newHumidity.text(`Humidity: ${humidity}%`);

    today.append(newH2, newTemp, newWind, newHumidity);
    
        
    const forecast5Day = $('<h2>');
    forecast5Day.text('5-Day Forecast:');

    const newDiv = $('<div>');
    // newDiv.attr('id', 'date-weather');
    newDiv.attr({'id': 'date-weather', 'class': 'col-lg-3 m-1'}); 
    newDiv.css('background-color', 'blue');

    // const newH3 = $('<h3>');
    // newH3.attr('id', 'date-date');
    // newH3.text("I'm tomorrows date heading");
    // // newH3.append(newSpan);

    // newDiv.append(newH3, newTemp, newWind, newHumidity);
    forecast.append(forecast5Day, newDiv);

};


