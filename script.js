const apiKey = "ТВОЙ_API_KEY_ЗДЕСЬ";
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            showError();
            return;
        }

        const data = await response.json();
        displayWeather(data);
        
    } catch (err) {
        console.error("Ошибка сети или сервера:", err);
    }
}

function displayWeather(data) {
    document.getElementById('cityName').innerText = data.name;
    document.getElementById('tempValue').innerText = Math.round(data.main.temp);
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity + "%";
    document.getElementById('windSpeed').innerText = data.wind.speed + " м/с";
    
    const icon = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // Меняем Hintergrund в зависимости от температуры
    const temp = data.main.temp;
    if (temp > 25) {
        document.body.style.background = "linear-gradient(45deg, #f093fb, #f5576c)";
    } else if (temp > 0) {
        document.body.style.background = "linear-gradient(45deg, #5ee7df, #b490ca)";
    } else {
        document.body.style.background = "linear-gradient(45deg, #2c3e50, #000000)";
    }

    document.getElementById('weatherContent').style.display = "block";
    document.getElementById('error').style.display = "none";
}

function showError() {
    document.getElementById('error').style.display = "block";
    document.getElementById('weatherContent').style.display = "none";
}

// Слушатели событий
searchBtn.addEventListener('click', () => checkWeather(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkWeather(cityInput.value);
});