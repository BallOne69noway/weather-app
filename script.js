const apiKey = "82f76d1848a79541540ce76aeebd42d4";
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function checkWeather(city) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    try {
        const [currRes, foreRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
        if (!currRes.ok) return;
        const currData = await currRes.json();
        const foreData = await foreRes.json();
        displayCurrent(currData);
        displayForecast(foreData);
    } catch (err) { console.error(err); }
}

function displayCurrent(data) {
    document.getElementById('cityName').innerText = data.name;
    document.getElementById('tempValue').innerText = Math.round(data.main.temp);
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity + "%";
    document.getElementById('windSpeed').innerText = data.wind.speed + " м/с";
    
    const anim = document.getElementById('weatherAnimation');
    const weather = data.weather[0].main;
    anim.style.display = 'none';
    anim.classList.remove('white-clouds', 'dark-clouds');

    if (weather === 'Clouds') {
        anim.style.display = 'block'; anim.classList.add('white-clouds');
        document.body.style.background = "#757f9a";
    } else if (weather === 'Rain') {
        anim.style.display = 'block'; anim.classList.add('dark-clouds');
        document.body.style.background = "#2c3e50";
    }
    document.getElementById('weatherContent').style.display = "block";
    document.getElementById('forecastPanel').style.display = "block";
}

function displayForecast(data) {
    const list = document.getElementById('forecastList');
    list.innerHTML = '';
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    daily.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('ru', { weekday: 'short' });
        list.innerHTML += `
            <div class="forecast-item">
                <span>${date}</span>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" width="35">
                <span>${Math.round(day.main.temp)}°C</span>
            </div>`;
    });
}

searchBtn.addEventListener('click', () => checkWeather(cityInput.value));