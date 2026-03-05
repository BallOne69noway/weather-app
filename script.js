const apiKey = "82f76d1848a79541540ce76aeebd42d4";
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function checkWeather(city) {
    if (!city) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) { showError(); return; }
        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        console.error("Ошибка:", err);
    }
}

function displayWeather(data) {
    document.getElementById('cityName').innerText = data.name;
    document.getElementById('tempValue').innerText = Math.round(data.main.temp);
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity + "%";
    document.getElementById('windSpeed').innerText = data.wind.speed + " м/с";
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    const animation = document.getElementById('weatherAnimation');
    const weather = data.weather[0].main;
    
    animation.classList.remove('white-clouds', 'dark-clouds');
    animation.style.display = 'none';

    let bg = "";

    if (weather === 'Clear') {
        bg = "linear-gradient(180deg, #2196F3, #64B5F6)";
    } else if (weather === 'Clouds') {
        bg = "linear-gradient(180deg, #757f9a, #d7dde8)";
        animation.style.display = 'block';
        animation.classList.add('white-clouds');
    } else if (weather === 'Rain' || weather === 'Drizzle' || weather === 'Thunderstorm') {
        bg = "linear-gradient(180deg, #2c3e50, #000000)";
        animation.style.display = 'block';
        animation.classList.add('dark-clouds');
    } else {
        bg = "linear-gradient(180deg, #4facfe, #00f2fe)";
    }

    document.body.style.background = bg;
    document.getElementById('weatherContent').style.display = "block";
    document.getElementById('error').style.display = "none";
}

function showError() {
    document.getElementById('error').style.display = "block";
    document.getElementById('weatherContent').style.display = "none";
}

searchBtn.addEventListener('click', () => checkWeather(cityInput.value));
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkWeather(cityInput.value); });