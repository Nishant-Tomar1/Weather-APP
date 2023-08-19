const apiKey = 'cffabb6ca949ab4abfad04ac16722f01';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');
const body = document.querySelector('.container');
const left = document.querySelector('.left-info')

const iconList = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchWeatherData(location) {
    //making Api url to get the data
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    // Fetch weather data from api
    fetch(apiUrl).then(response => response.json()).then(data => {
        // Updating todays info for the left container
        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;
        console.log(data);
        //console.log(todayWeatherIconCode[2]);

        todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
        todayWeatherIcon.className = `bx bx-${iconList[todayWeatherIconCode]}`;
        todayTemp.textContent = todayTemperature;

        // Updating location and temperature in left side
        const locationElement = document.querySelector('.today-info > div > span');
        locationElement.textContent = `${data.city.name}, ${data.city.country}`;

        const weatherDescriptionElement = document.querySelector('.today-weather > h3');
        weatherDescriptionElement.textContent = todayWeather;

        const feelsLike = document.querySelector('.today-weather > h4');
        feelsLike.textContent = `Feels like ` + `${Math.round(data.list[0].main.feels_like)}°C`;

        const highTemp = document.querySelector('.today-weather > h5 > .Highest');
        highTemp.textContent = `${Math.round(data.list[0].main.temp_max)}°C`;

        const lowTemp = document.querySelector('.today-weather > h5 > .Lowest');
        lowTemp.textContent = `${Math.round(data.list[0].main.temp_min)}°C `;

        // Updating todays info in the right "day-info" section
        const todayPrecipitation = `${data.list[0].pop}%`;
        const todayHumidity = `${data.list[0].main.humidity}%`;
        const todayWindSpeed = `${data.list[0].wind.speed} km/h -` + ` ${data.list[0].wind.deg}\u00B0 `;

        const dayInfoContainer = document.querySelector('.day-info');
        dayInfoContainer.innerHTML = `

            <div>
                <span class="title">PRECIPITATION</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">HUMIDITY</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">WIND SPEED</span>
                <span class="value">${todayWindSpeed}</span>
            </div>

        `;

        // Updating next 4 days weather
        const today = new Date();
        const nextDaysData = data.list.slice(1);

        const uniqueDays = new Set();
        let count = 0;
        daysList.innerHTML = '';
        for (const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString('en', { weekday: 'short' });
            const dayTemp = `${Math.round(dayData.main.temp)}°C`;
            const iconCode = dayData.weather[0].icon;

            // Ensure the day isn't duplicate and today
            if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                uniqueDays.add(dayAbbreviation);
                daysList.innerHTML += `
                
                    <li>
                        <i class='bx bx-${iconList[iconCode]}'></i>
                        <span>${dayAbbreviation}</span>
                        <span class="day-temp">${dayTemp}</span>
                    </li>

                `;
                count++;
            }

            // Stop after getting 4 distinct days
            if (count === 4) break;
        }

        var bg = Math.floor(Math.random() * 10 + 1);
        var bgImageUrl = "images/day/Weather-Background" + bg + ".jpg";
        var bgImageUrlNight = "images/night/bg" + bg + ".jpg";
        document.querySelector("body").style.backgroundImage = `url("${bgImageUrl}")`;

        function night() {
            console.log("night here")
            document.querySelector("body").style.backgroundImage = `url("${bgImageUrlNight}")`;
            left.style.background = "black";
            body.style.background = "black";
            body.style.border = "1.5px solid white";
            left.style.border = "1.5px solid white";
            locButton.style.background = "rgb(59, 0, 130)";
            locButton.style.border = "1.25px solid white";
        }

        function day() {
            document.querySelector("body").style.backgroundImage = `url("${bgImageUrl}")`;
            left.style.background = `url("images/bg.avif")`;
            body.style.background = "#013459";
            body.style.border = "1.5px solid white";
            left.style.border = "1.5px solid white";
            locButton.style.background = " #4688ec";
            locButton.style.border = "1.25px solid white";
        }

        if (todayWeatherIconCode[2] == 'n') {
            night();
        }

        else {
            day();
        }
    }).catch(error => {
        alert(`DATA NOT AVAILABLE !!  Please Enter a different location`);
    });
}

//fething data (dafault-bhubaneswar) and updating as per the input entered by user
document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Bhubaneswar';
    fetchWeatherData(defaultLocation);
});

locButton.addEventListener('click', () => {
    const location = prompt('Enter a location :');
    if (!location) return;

    fetchWeatherData(location);
});