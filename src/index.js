import './style.css';
import './spinner.css';
import './fontello.css';
import { setRandomBackground } from './background';
import { TZDateMini } from '@date-fns/tz';
import { format } from 'date-fns';

const Icons = (() => {
    const iconMap = new Map();
    const ctxFunc = require.context('./images/weather/', false, /\.svg$/i);

    ctxFunc.keys().forEach(value => {
        iconMap.set(value.slice(2, -4), ctxFunc(value));
    });

    return iconMap;
})();

const Units = Object.freeze({
    metric: 'metric', 
    us:     'us', 
    uk:     'uk',

    isValid: function(unit) {
        if (unit == null) {
            return false;
        }

        if (!Object.prototype.hasOwnProperty.call(this, unit) || typeof this[unit] === 'function') {
            return false;
        }

        return true;
    }
});

const DefaultCities = Object.freeze([
    'Seville',
    'London', 
    'Tokyo',
    'New York',
]);

function getRandomCityName() {
    return DefaultCities[Math.floor(Math.random() * DefaultCities.length)];
}

function getLastSearch() {
    return localStorage.getItem("lastSearch");
}

function setLastSearch(search) {
    localStorage.setItem("lastSearch", search);
}

function composeQuery(location, unit = Units.metric) {
    if (typeof location !== 'string' || location.trim() === '') {
        throw Error('Invalid location');
    }

    if (!Units.isValid(unit)) {
        throw Error('Invalid unit type')
    }

    const queryBase     = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
    const queryKey      = 'G87UBN8KAPQMVYJVVWSNM77J8';
    const queryType     = 'json';
    const queryLang     = 'en';
    const queryLocation = location.trim();
    const queryUnit     = unit;
    
    return `${queryBase}/${queryLocation}?unitGroup=${queryUnit}&contentType=${queryType}&key=${queryKey}&lang=${queryLang}`;
}

async function getWeather(location) {
    try {
        const response = await fetch(composeQuery(location), { mode: 'cors' });
        if (!response.ok) {
            return null;
        }

        return await response.json();
    }
    catch (error) {
        console.warn("Unable to retrieve weather data");
        return null;
    }
}

function processWeatherJSON(json) {
    function getDay(index) {
        return {
            epoch:   json.days[index].datetimeEpoch,
            icon:    json.days[index].icon,
            tempMin: json.days[index].tempmin,
            tempMax: json.days[index].tempmax,
        };
    }

    return {
        address:        json.resolvedAddress,
        timezone:       json.timezone,
        timezoneOffset: json.tzoffset,
        // Current time.
        current: {
            address:  json.resolvedAddress,
            epoch:    json.currentConditions.datetimeEpoch,
            icon:     json.currentConditions.icon,
            temp:     json.currentConditions.temp,
            humidity: json.currentConditions.humidity,
            precip:   json.currentConditions.precipprob,
            wind:     json.currentConditions.windspeed,
        },
        // Forecast for the next five days (skip the first one as it is the current day).
        forecast: [getDay(1), getDay(2), getDay(3), getDay(4), getDay(5)]
    }
}

async function showLoading(minTime = 0.5) {
    const weather  = document.querySelector('.weather');
    const spinner  = document.querySelector('.spinner');
    const noresult = document.querySelector('.noresult');

    weather .classList.add('hidden');
    spinner .classList.remove('hidden');
    noresult.classList.add('hidden');

    await new Promise(resolve => {
        setTimeout(resolve, minTime * 1000);
    });
}

function showWeather() {
    const weather  = document.querySelector('.weather');
    const spinner  = document.querySelector('.spinner');
    const noresult = document.querySelector('.noresult');

    weather.classList.remove('hidden');
    spinner.classList.add('hidden');
    noresult.classList.add('hidden');
}

function showNoResults(search) {
    const weather  = document.querySelector('.weather');
    const spinner  = document.querySelector('.spinner');
    const noresult = document.querySelector('.noresult');
    const input    = noresult.querySelector('.input');

    input.textContent = search;

    weather .classList.add('hidden');
    spinner .classList.add('hidden');
    noresult.classList.remove('hidden');
}

function createDisplay() {
    const display = document.querySelector('.weather');
    if (!display) {
        console.error('Weather display not found');
        return null;
    }

    const currentWhere     = display.querySelector('.weather-current .where');
    const currentDate      = display.querySelector('.weather-current .date');
    const currentTempIcon  = display.querySelector('.weather-current .temp .icon');
    const currentTempValue = display.querySelector('.weather-current .temp .value');
    const currentTempC     = display.querySelector('.weather-current .temp .degree');
    const currentTempF     = display.querySelector('.weather-current .temp .fahrenheit');
    const currentHumidity  = display.querySelector('.weather-current .extra-data .humidity');
    const currentPrecip    = display.querySelector('.weather-current .extra-data .precip');
    const currentWind      = display.querySelector('.weather-current .extra-data .wind');

    if (!currentWhere || !currentDate || !currentTempIcon || !currentTempValue || !currentTempC || !currentTempF || !currentHumidity || !currentPrecip || !currentWind) {
        console.error('Current weather element not found');
        return null;
    }

    const forecast = [];
    
    display.querySelectorAll('.weather-forecast .card').forEach(card => {
        const date = card.querySelector('.date');
        const dayName  = date?.firstElementChild;
        const dayMonth = date?.firstElementChild?.nextElementSibling;
        const icon = card.querySelector('.icon');
        const tempMax = card.querySelector('.max');
        const tempMin = card.querySelector('.min');

        if (!dayName || !dayMonth || !icon || !tempMax || !tempMin) {
            console.error('Invalid forcast card, element not found');
            return;
        }

        forecast.push({ dayName, dayMonth, icon, tempMax, tempMin })
    });

    return function(data) {
        currentWhere    .textContent = data.current.address;
        currentDate     .textContent = format(new TZDateMini(new Date(), data.timezone), 'iiii d/M, p');
        currentTempValue.textContent = Math.trunc(data.current.temp);
        currentHumidity .textContent = `${Math.round(data.current.humidity)}%`;
        currentPrecip   .textContent = `${Math.round(data.current.precip)}%`;
        currentWind     .textContent = `${Math.round(data.current.wind)} km/h`;
        currentTempIcon.src = Icons.get(data.current.icon);

        data.forecast.forEach((item, index) => {
            if (index >= forecast.length) {
                return;
            }
            // Convert the epoch to miliseconds and create a date.
            const date = new TZDateMini(Number(item.epoch) * 1000, data.timezone);

            forecast[index].icon.src = Icons.get(item.icon);
            forecast[index].dayName .textContent = format(date, 'iii');
            forecast[index].dayMonth.textContent = format(date, 'd/M');
            forecast[index].tempMax .textContent = `${Math.trunc(item.tempMax)}°`;
            forecast[index].tempMin .textContent = `${Math.trunc(item.tempMin)}°`;
        });
    }
}

async function doSearch(display, search) {
    const value = search.trim();
    if (value === '') {
        console.error('Invalid search term');
        return;
    }

    const [,json] = await Promise.all([showLoading(0.5), getWeather(value)]);
    if (json === null) {
        showNoResults(value);
        return;
    }
    
    const data = processWeatherJSON(json);
    if (!data) {
        console.error('Unable to process weather data');
        return;
    }
    // Save last search to show it the next time the page is open.
    setLastSearch(value);

    display(data);
    showWeather();
}

(function setup() {
    const form    = document.querySelector('#weather-search-form');
    const display = createDisplay();

    if (!form) {
        console.error('Weather form not found');
        return;
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();

        const input = form.querySelector('input');
        if (!input) {
            console.error('Weather form input not found');
            return;
        }

        await doSearch(display, input.value);
    })

    setRandomBackground();

    const lastSearch = getLastSearch();
    if (lastSearch != null) {
        doSearch(display, lastSearch);
    }
    else {
        doSearch(display, getRandomCityName());
    }
})();