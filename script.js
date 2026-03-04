const apiKey = "82f76d1848a79541540ce76aeebd42d4";
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

    // --- НАЧАЛО БЛОКА АНИМАЦИИ ---
    const animationContainer = document.getElementById('weatherAnimation');
    const weatherMain = data.weather[0].main; // Основной тип погоды (Clouds, Rain, Clear и т.д.)
    
    // Сначала убираем все старые классы анимации
    animationContainer.classList.remove('storm-clouds');
    animationContainer.style.display = 'none'; // Скрываем анимацию по умолчанию

    let backgroundGradient = "";

    // Логика смены фона и анимации
    if (weatherMain === 'Clear') {
        // Ясно
        backgroundGradient = "linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)";
        // Анимацию не включаем
    } else if (weatherMain === 'Clouds') {
        // Облачно (просто тучи летают)
        backgroundGradient = "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
        animationContainer.style.display = 'block'; // Показываем тучи
    } else if (weatherMain === 'Rain' || weatherMain === 'Drizzle' || weatherMain === 'Thunderstorm') {
        // Дождь, морось или гроза (черные тучи)
        backgroundGradient = "linear-gradient(to bottom, #202020, #111111)";
        animationContainer.style.display = 'block'; // Показываем тучи
        animationContainer.classList.add('storm-clouds'); // Делаем их темными
    } else if (weatherMain === 'Snow') {
        // Снег
        backgroundGradient = "linear-gradient(to bottom, #e6e9f0 0%, #eef1f5 100%)";
        // Здесь можно потом добавить анимацию снега
    } else {
        // Дефолтный фон для всего остального (туман и т.д.)
        backgroundGradient = "linear-gradient(to bottom, #304352, #d7d2cc)";
    }

    // Применяем новый градиент к фону страницы
    document.body.style.background = backgroundGradient;
    // --- КОНЕЦ БЛОКА АНИМАЦИИ ---

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