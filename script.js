const apiKey = "82f76d1848a79541540ce76aeebd42d4";
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function checkWeather(city) {
    if (!city) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            showError();
            return;
        }

        const data = await response.json();
        console.log("Данные получены:", data); // Для отладки
        displayWeather(data);
        
    } catch (err) {
        console.error("Ошибка сети:", err);
    }
}

function displayWeather(data) {
    // Заполнение данных
    document.getElementById('cityName').innerText = data.name;
    document.getElementById('tempValue').innerText = Math.round(data.main.temp);
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity + "%";
    document.getElementById('windSpeed').innerText = data.wind.speed + " м/с";
    
    const icon = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

    // Логика анимации и фона
    const animationContainer = document.getElementById('weatherAnimation');
    const weatherMain = data.weather[0].main; 
    
    animationContainer.classList.remove('storm-clouds');
    animationContainer.style.display = 'none';

    let bg = "";

    if (weatherMain === 'Clear') {
        bg = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
    } else if (weatherMain === 'Clouds') {
        bg = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
        animationContainer.style.display = 'block';
    } else if (weatherMain === 'Rain' || weatherMain === 'Drizzle' || weatherMain === 'Thunderstorm') {
        bg = "linear-gradient(135deg, #202020, #111111)";
        animationContainer.style.display = 'block';
        animationContainer.classList.add('storm-clouds');
    } else if (weatherMain === 'Snow') {
        bg = "linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)";
    } else {
        bg = "linear-gradient(135deg, #304352, #d7d2cc)";
    }

    document.body.style.background = bg;
    document.getElementById('weatherContent').style.display = "block";
    document.getElementById('error').style.display = "none";
}

function showError() {
    document.getElementById('error').style.display = "block";
    document.getElementById('weatherContent').style.display = "none";
}

// Слушатели
searchBtn.addEventListener('click', () => {
    checkWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkWeather(cityInput.value);
    }
});