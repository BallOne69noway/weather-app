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
    
    // Получаем большую иконку (@4x)
    const icon = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

    // Логика анимации и фона (более iOS градиенты)
    const animationContainer = document.getElementById('weatherAnimation');
    const weatherMain = data.weather[0].main; 
    
    // Сброс классов
    animationContainer.classList.remove('storm-clouds');
    animationContainer.style.display = 'none';

    let bg = "";

    if (weatherMain === 'Clear') {
        // Ясно (iOS синий)
        bg = "linear-gradient(180deg, #2196F3 0%, #64B5F6 100%)";
    } else if (weatherMain === 'Clouds') {
        // Облачно (iOS серый)
        bg = "linear-gradient(180deg, #9E9E9E 0%, #616161 100%)";
        animationContainer.style.display = 'block'; // Включаем облака
    } else if (weatherMain === 'Rain' || weatherMain === 'Drizzle' || weatherMain === 'Thunderstorm') {
        // Дождь/Гроза (темный iOS)
        bg = "linear-gradient(180deg, #212121 0%, #000000 100%)";
        animationContainer.style.display = 'block';
        animationContainer.classList.add('storm-clouds'); // Делаем облака темными
    } else if (weatherMain === 'Snow') {
        // Снег
        bg = "linear-gradient(180deg, #E0E0E0 0%, #BDBDBD 100%)";
    } else {
        // Дефолтный (туман и т.д.)
        bg = "linear-gradient(180deg, #455A64 0%, #263238 100%)";
    }

    // Применяем фон и показываем контент
    document.body.style.background = bg;
    document.getElementById('weatherContent').style.display = "block";
    document.getElementById('error').style.display = "none";
}

function showError() {
    document.getElementById('error').style.display = "block";
    document.getElementById('weatherContent').style.display = "none";
}

// Слушатели событий
searchBtn.addEventListener('click', () => {
    checkWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkWeather(cityInput.value);
    }
});