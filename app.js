"use strict";

const api = "https://api.openweathermap.org/data/2.5/forecast";
const apiKey = "ae9ca2c216770a504cefc6f82a364b91";

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);
const searchForm = document.querySelector("form.search-form");
searchForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
});


function setQuery(evt) {
    console.log("Starting");
    if (evt.keyCode == 13) {
        console.log(`Fetching ${searchbox.value}`);
        let url = `${api}?q=${searchbox.value}&appid=${apiKey}&units=metric`;
        getResults(url);
    }
}
function getResults(url) {
    console.log("Getting Results");
    fetch(url)
    .then(weather => {
        return weather.json();
    }).then(displayResults);
}

function displayResults(weather) {
    let icon = document.querySelector(".icon");
    
    
    let returnWeather = weather.list[0];
    let iconcode = returnWeather.weather[0].icon;
    icon.src =  `http://openweathermap.org/img/wn/${iconcode}@2x.png`;
    let city = document.querySelector("h2.city");
    city.textContent = `${weather.city.name}, ${weather.city.country}`;

    let now = new Date();
    let date = document.querySelector("time.date");
    let day = document.querySelector("p.day");
    let [day1, date1] = dateBuilder(now);
    date.textContent = date1;
    day.textContent = day1;
    let temperature = document.querySelector("p.temperature");
    temperature.innerHTML = `${Math.round(returnWeather.main.temp)}<span><sup>o</sup>C</span>`;
    let mainWeather = document.querySelector("span.weather");
    mainWeather.textContent = returnWeather.weather[0].main;
    let lowTemp = document.querySelector("span.min");
    lowTemp.textContent = returnWeather.main.temp_min;
    let highTemp = document.querySelector("span.max");
    highTemp.textContent = returnWeather.main.temp_max;
    let sunrise = document.querySelector("td.sunrise");
    let d = new Date(weather.city.sunrise * 1000);
    sunrise.textContent = `${d.getUTCHours() + 1}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`;
    let sunset = document.querySelector("td.sunset");
    d = new Date(weather.city.sunset * 1000);
    sunset.textContent = `${d.getUTCHours() + 1}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`;
    let humidity = document.querySelector("td.humidity");
    humidity.textContent = returnWeather.main.humidity;
    let weatherDescription = document.querySelector("td.weather-description");
    weatherDescription.textContent = returnWeather.weather[0].description;
    let wind = document.querySelector("td.wind");
    wind.textContent = returnWeather.wind.speed;
    let cloudiness = document.querySelector("td.cloudiness");
    cloudiness.textContent = returnWeather.clouds.all;
    let visibility = document.querySelector("td.visibility");
    visibility.textContent = returnWeather.visibility;
    let pressure = document.querySelector("td.pressure");
    pressure.textContent = returnWeather.main.pressure;
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octomber", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return [`${day}`,  `${date} ${month} ${year}`];
}





let errorTag = document.createElement("p");
errorTag.textContent = "Could not get your Location, Use Search Instead...";
let errorContainer = document.querySelector("div.geolocation-container");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else { 
        errorContainer.appendChild(errorTag);
        console.log("Unable to gain Location Access: Geolocation not Supported");
    }
}

function getPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let url = `${api}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    getResults(url);
}

function showError(error) {
    errorContainer.appendChild(errorTag);
    console.log(`Unable to gain Location Access, Error Code: ${error.code}`);
}

window.addEventListener("load", getLocation)

let offlineContainer = document.querySelector("div.offline-notifier");

function offlineNotice() {
    let offlineTag = document.createElement("p");
    offlineTag.textContent = "Looks Like you're Offline";
    offlineContainer.appendChild(offlineTag);
    console.log("Offline")
}

if(!navigator.onLine) {
    offlineNotice();
    console.log("Passed")
} else {
    console.log("Working")
}
