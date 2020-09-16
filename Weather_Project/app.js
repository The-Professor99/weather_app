"use strict";

const api = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "ae9ca2c216770a504cefc6f82a364b91";

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("./serviceWorker.js")
        .then(function(registration) {
            console.log("Service worker registered");
            registration.addEventListener('updatefound', function() {
                registration.update();
            })    
        }
        ).catch(err => console.log("Service Worker not registered", err))
    })
}

function getLocalName() {
    if (localStorage.getItem("name") === null || localStorage.getItem("name") === "") {
        let value = prompt("Please Enter Your Name");
        if(value !== null && value !== "") {
            if(typeof(Storage) !== "undefined") {
                localStorage.setItem("name", value);
                return localStorage.getItem("name");
            }
        }
    } else {
        return localStorage.getItem("name");
    }
    
}

function welcomeUser() {
    let welcome = document.querySelector(".welcome-note");
    let welcomeTag = document.createElement("p");
    let userName = getLocalName();
    if(userName !== undefined) {
        welcomeTag.textContent = `Hello ${userName}!`;
        welcome.appendChild(welcomeTag);
        welcome.style.boxShadow = "0px 4px 3px 8px rgba(243, 238, 243, 0.7)";
    }
}

welcomeUser();

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octomber", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return [`${day}`,  `${date} ${month} ${year}`];
}

function displayResults(weather) {
    let icon = document.querySelector(".icon");
    let iconcode = weather.weather[0].icon;
    icon.src =  `https://openweathermap.org/img/wn/${iconcode}@2x.png`;

    let city = document.querySelector("h2.city");
    city.textContent = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let [day1, date1] = dateBuilder(now);

    let day = document.querySelector("p.day");
    day.textContent = day1;

    let date = document.querySelector("p.date");
    date.textContent = date1;

    let temperature = document.querySelector("p.temperature");
    temperature.innerHTML = `${Math.round(weather.main.temp)}<span><sup>o</sup>C</span>`;

    let mainWeather = document.querySelector("span.weather");
    mainWeather.textContent = ` ${weather.weather[0].main}. `;

    let lowTemp = document.querySelector("span.min");
    lowTemp.textContent = weather.main.temp_min;

    let highTemp = document.querySelector("span.max");
    highTemp.textContent = weather.main.temp_max;

    let sunrise = document.querySelector("td.sunrise");
    let d = new Date(weather.sys.sunrise * 1000);
    sunrise.textContent = `${d.getUTCHours() + 1}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`;

    let sunset = document.querySelector("td.sunset");
    d = new Date(weather.sys.sunset * 1000);
    sunset.textContent = `${d.getUTCHours() + 1}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`;

    let humidity = document.querySelector("td.humidity");
    humidity.textContent = `${weather.main.humidity}%`;

    let weatherDescription = document.querySelector("td.weather-description");
    weatherDescription.textContent = weather.weather[0].description;

    let wind = document.querySelector("td.wind");
    wind.textContent = `${weather.wind.speed}m/s`;

    let cloudiness = document.querySelector("td.cloudiness");
    cloudiness.textContent = `${weather.clouds.all}%`;

    let visibility = document.querySelector("td.visibility");
    visibility.textContent = `${weather.visibility}m`;

    let pressure = document.querySelector("td.pressure");
    pressure.textContent = `${weather.main.pressure}hPa`;
}

function getLocalWeather() {
    if (localStorage.getItem("weather") !== null && localStorage.getItem("weather") !== "") {
        let weather = JSON.parse(localStorage.getItem("weather"));
        displayResults(weather);
    }
}


function getResults(url) {
    let failedResponse = document.createElement("p");
    let responseHolder = document.querySelector(".searchbox-container");
    failedResponse.textContent = `Failed to get Weather Data`;
    fetch(url)
    .then(
        function(response) {
            if (response.status !== 200) {
                responseHolder.appendChild(failedResponse);
                getLocalWeather();
                return;
            }
            response.json().then(function(weather) {
                displayResults(weather);
                localStorage.setItem("weather", JSON.stringify(weather))
            });
          }
        )
        .catch(function(err) {
            responseHolder.appendChild(failedResponse);
            getLocalWeather();
            return;
        });
        
}

function showError(error) {
    let errorTag = document.createElement("p");
    errorTag.textContent = "Could not get your Location, Use Search Instead...";
    let errorContainer = document.querySelector("div.geolocation-container");
    errorContainer.appendChild(errorTag);
    getLocalWeather();
}

function getPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let url = `${api}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    getResults(url);
}

function getLocation() {
    let errorTag = document.createElement("p");
    errorTag.textContent = "Could not get your Location, Use Search Instead...";
    let errorContainer = document.querySelector("div.geolocation-container");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else { 
        errorContainer.appendChild(errorTag);
        getLocalWeather();
    }
}

function offlineNotice() {
    let offlineTag = document.createElement("p");
    let offlineContainer = document.querySelector(".offline-container")
    let searchContainer = document.querySelector(".searchbox-container");
    offlineContainer.appendChild(offlineTag);
    offlineTag.textContent = "Looks Like you're Offline, Go online to search and get Recent Data!";
    searchContainer.style.display = "none";
}

function checkStatus() {
    if(!navigator.onLine) {
        offlineNotice();
        getLocalWeather();
    } else {
        getLocation();
    }
}

checkStatus();

function setQuery(evt) {
    console.log("Starting");
    if (evt.keyCode == 13) {
        console.log(`Fetching ${searchbox.value}`);
        let url = `${api}?q=${searchbox.value}&appid=${apiKey}&units=metric`;
        getResults(url);
    }
}

const searchForm = document.querySelector("form.search-form");
searchForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
});

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);

window.addEventListener("offline", offlineNotice);