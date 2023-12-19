
const today = $('#today'); //selecting the section to append a div etc for today's forecast
const forecast = $('#forecast'); // selecting the section to append a div etc to the rest of the forecast
let storedCity = [];
let i = 0;
let isToday = true;

renderLocalStorage();

$('#search-button').on('click', function(event){
    event.preventDefault();
    let citySearched = $('#search-input').val();
    fetchCityForecast(citySearched); //run the fetch with the city the user searched
});

$('#clear-button').on('click', function(event){
    event.preventDefault();
    localStorage.clear();
    $('.history-btns').empty();
    storedCity = [];
});


function fetchCityForecast(city){
    
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=6b4a10c6ed815160709463b2908e2d4d";

    fetch(queryURL)
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);

        for(let i = 0; i < data.list.length; i++){

            let city = data.city.name;
            let apiDate = data.list[i].dt_txt.substr(0, 10); //.substr(0, 10) keeps the first 10 characters of the string so from this: 2023-12-18 12:00:00 to this: 2023-12-18
            let properDate = dayjs(`${apiDate}`, `YYYY-MM-DD`).format(`(DD/MM/YYYY)`); // converts the API date to a different format
            let weatherIcon = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
            let wind = (data.list[i].wind.speed * 2.237).toFixed(2); //the api wind speed is meters per sec (MPS) so to get MPH = MPS * 2.237
            let temp = data.list[i].main.temp;
            let humidity = data.list[i].main.humidity;

            console.log(data.list.length); //40 - the amount of forecast objects

            let day = data.list[i].dt_txt.substr(8, 2); //to obtain the day from the date text of the API - to use to show only single day forecasts
            console.log(day);

            let time = data.list[i].dt_txt.substr(11, 2); //to obtain the hour from the date text of the API - to use to show only midday forecasts
            console.log(time);

            if(isToday){
                forecast.empty(); //move elsewhere?
                today.empty(); //move elsewhere?
                today.css('border', '1px solid black');
                const forecast5Day = $('<h2>');
                forecast5Day.text('5-Day Forecast:');
                forecast.append(forecast5Day);
                renderWeather(day, city, properDate, weatherIcon, temp, wind, humidity);
                isToday = false;
            }else if (!isToday && (time == 12) ){
                renderWeather(day, city, properDate, weatherIcon, temp, wind, humidity);
            }
        };

        if(storedCity.includes(city)){
            return
        }else{
            searchHistoryBtn(city);
            storeSearchHistory(city);
        }; 
    });
};

function renderWeather(day, city, properDate, weatherIcon, temp, wind, humidity){
    
    const newImg = $('<img>');
    newImg.attr({'src': weatherIcon, 'id': `day-${day}-img`});
    
    const newTemp = $('<p>');
    newTemp.attr('id', `day-${day}-temp`);
    newTemp.text(`Temp: ${temp}°c`);

    const newWind = $('<p>');
    newWind.attr('id', `day-${day}-wind`);
    newWind.text(`Wind: ${wind} MPH`);

    const newHumidity = $('<p>');
    newHumidity.attr('id', `day-${day}-humidity`);
    newHumidity.text(`Humidity: ${humidity}%`);

    if(isToday){
        const newH2 = $('<h2>');
        newH2.attr('id', `todays-date-${day}`);
        newH2.text(`${city} ${properDate}`);
        newH2.append(newImg); //adds img to the header
        today.append(newH2, newTemp, newWind, newHumidity);
    }else{
        const newDiv = $('<div>');
        newDiv.attr({'id': `day-${day}-weather`, 'class': 'col-lg-3 m-1'}); 
        newDiv.css({'background-color': 'blue', 'color': 'white'});

        const newH4 = $('<h4>');
        newH4.attr('id', `date-${day}`);
        newH4.text(`${city} ${properDate}`);
        newH4.append(newImg); //adds img to the header

        newDiv.append(newH4, newTemp, newWind, newHumidity);
        forecast.append(newDiv);
    };
};

/****************************** LOCAL STORAGE & HISTORY ****************************************/

function searchHistoryBtn(city){
    let newBtn = $('<button>');
    newBtn.attr({'class': 'btn btn-secondary col-12 mt-2', 'data-city': `${city}`});
    newBtn.text(`${city}`);
    $('.history-btns').append(newBtn);
};

function storeSearchHistory(city){
    storedCity.push(city);
    localStorage.setItem("city", JSON.stringify(storedCity));
};

function renderLocalStorage(){
    storedCity = (JSON.parse(localStorage.getItem('city')) || storedCity);
    for(let i = 0; i < storedCity.length; i++){
        searchHistoryBtn(storedCity[i]);
    };
};

//bring up the city forecast when a history button is clicked
$('.btn-secondary').on('click', function(event){ 
    event.preventDefault();
    let target = event.target.dataset.city;
    fetchCityForecast(target);
})

/********************************************************************************************/


//DONE save searched city to local storage
//DONE create a button for each city searched/saved
//DONE pull the info for the saved city if it's button is clicked
// how to centre my history btns?
// fix bug where by when a new history btn is added and then you click it - it seems to refresh the screen..?
