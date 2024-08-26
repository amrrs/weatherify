const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weather-icon-elem');

const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

function getWeather() {
    const city = cityInput.value;
    if (city) {
        fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('City not found. Please try again.');
            });
    }
}

function displayWeather(data) {
    const currentCondition = data.current_condition[0];
    const location = data.nearest_area[0];
    cityName.textContent = `${location.areaName[0].value}, ${location.country[0].value}`;
    temperature.textContent = `${currentCondition.temp_C}°C`;
    description.textContent = currentCondition.weatherDesc[0].value;
    setWeatherIcon(currentCondition.weatherCode);
    document.getElementById('wind-speed').textContent = `${currentCondition.windspeedKmph} km/h`;
    document.getElementById('humidity').textContent = `${currentCondition.humidity}%`;
    document.getElementById('uv-index').textContent = currentCondition.uvIndex;
    weatherCard.classList.remove('hidden');
}

function setWeatherIcon(weatherCode) {
    let iconClass;
    if (weatherCode >= 200 && weatherCode < 300) {
        iconClass = 'fa-bolt';
    } else if (weatherCode >= 300 && weatherCode < 500) {
        iconClass = 'fa-cloud-rain';
    } else if (weatherCode >= 500 && weatherCode < 600) {
        iconClass = 'fa-umbrella';
    } else if (weatherCode >= 600 && weatherCode < 700) {
        iconClass = 'fa-snowflake';
    } else if (weatherCode >= 700 && weatherCode < 800) {
        iconClass = 'fa-smog';
    } else if (weatherCode === 113) {
        iconClass = 'fa-sun';
    } else {
        iconClass = 'fa-cloud';
    }
    weatherIcon.className = `fas ${iconClass}`;
}

// Autocomplete functionality
const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Moscow', 'Dubai', 'Singapore', 'Rome', 'Berlin', 'Toronto', 'Hong Kong', 'Bangkok', 'Istanbul', 'Mumbai', 'Seoul', 'Mexico City', 'São Paulo', 'Cairo', 'Los Angeles', 'Beijing', 'Amsterdam', 'Vienna', 'Madrid', 'Stockholm', 'Prague', 'Warsaw', 'Budapest', 'Athens', 'Lisbon', 'Dublin', 'Copenhagen', 'Oslo', 'Helsinki', 'Zurich', 'Brussels', 'Barcelona', 'Milan', 'Munich', 'Frankfurt', 'Vancouver', 'Montreal', 'Chicago', 'San Francisco', 'Boston', 'Washington D.C.', 'Miami', 'Seattle', 'Dallas', 'Houston'];

function autocomplete(inp, arr) {
    let currentFocus;
    inp.addEventListener("input", function(e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function(e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

autocomplete(cityInput, cities);