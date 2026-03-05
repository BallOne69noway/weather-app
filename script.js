const apiKey = "82f76d1848a79541540ce76aeebd42d4";
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function checkWeather(city) {
    if (!city) return;
    
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    try {
        const response = await fetch(currentUrl);
        if (!response.ok) {
            showError();
            return;
        }
        const currentData = await response.json();
        
        // Если первый запрос ок, запрашиваем прогноз
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        displayCurrent(currentData);
        displayForecast(forecastData);
    } catch (err) {
        console.error("Ошибка запроса:", err);
        showError();
    }
}

function displayCurrent(data) {
    document.getElementById('error').style.display = "none";
    document.getElementById('weatherContent').style.display = "block";
    document.getElementById('forecastPanel').style.display = "block";

    document.getElementById('cityName').innerText = data.name;
    document.getElementById('tempValue').innerText = Math.round(data.main.temp);
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity + "%";
    document.getElementById('windSpeed').innerText = data.wind.speed + " м/с";
    
    const anim = document.getElementById('weatherAnimation');
    const weather = data.weather[0].main;
    
    anim.style.display = 'none';
    anim.classList.remove('white-clouds', 'dark-clouds');

    let bg = "linear-gradient(180deg, #1a1a1a, #000000)";

    if (weather === 'Clear') {
        bg = "linear-gradient(180deg, #56CCF2, #2F80ED)";
    } else if (weather === 'Clouds') {
        bg = "linear-gradient(180deg, #757f9a, #d7dde8)";
        anim.style.display = 'block';
        anim.classList.add('white-clouds');
    } else if (weather === 'Rain' || weather === 'Drizzle' || weather === 'Thunderstorm') {
        bg = "linear-gradient(180deg, #232526, #414345)";
        anim.style.display = 'block';
        anim.classList.add('dark-clouds');
    }

    document.body.style.background = bg;
}

function displayForecast(data) {
    const list = document.getElementById('forecastList');
    list.innerHTML = '';
    
    // Берем данные на 12:00 каждого дня
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    
    daily.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('ru', { weekday: 'short' });
        list.innerHTML += `
            <div class="forecast-item">
                <span style="text-transform: capitalize;">${date}</span>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" width="35">
                <span>${Math.round(day.main.temp)}°C</span>
            </div>`;
    });
}

function showError() {
    document.getElementById('error').style.display = "block";
    document.getElementById('weatherContent').style.display = "none";
    document.getElementById('forecastPanel').style.display = "none";
}

searchBtn.addEventListener('click', () => checkWeather(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkWeather(cityInput.value);
});