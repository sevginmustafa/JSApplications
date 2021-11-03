function attachEvents() {
    document.getElementById('submit').addEventListener('click', getForecast);
}

async function getForecast() {
    const weatherSymbols = {
        'Sunny': '&#x2600',
        'Partly sunny': '&#x26C5',
        'Overcast': '&#x2601',
        'Rain': '&#x2614',
        'Degrees': '&#176'
    }

    const divForecast = document.getElementById('forecast');
    divForecast.style.display = '';
    divForecast.innerHTML = '';

    const divCurrent = document.createElement('div');
    divCurrent.id = 'current';
    divCurrent.innerHTML = '<div class="label">Current conditions</div>';

    const divUpcoming = document.createElement('div');
    divUpcoming.id = 'upcoming';
    divUpcoming.innerHTML = '<div class="label">Three-day forecast</div>';

    try {
        const code = await getLocationCode(document.getElementById('location').value);

        const [current, upcoming] = await Promise.all([
            getCurrentForecast(code),
            getUpcomingForecast(code)
        ]);

        const divCurrentForecast = document.createElement('div');
        divCurrentForecast.classList.add('forecasts');
        divCurrentForecast.innerHTML = `<span class="condition symbol">${weatherSymbols[current.forecast.condition]}</span>
                                        <span class="condition">
                                        <span class="forecast-data">${current.name}</span>
                                        <span class="forecast-data">${current.forecast.low}${weatherSymbols.Degrees}/${current.forecast.high}${weatherSymbols.Degrees}</span>
                                        <span class="forecast-data">${current.forecast.condition}</span>
                                        </span>`;

        divCurrent.appendChild(divCurrentForecast);

        const divUpcomingForecast = document.createElement('div');
        divUpcomingForecast.classList.add('forecast-info');

        upcoming.forecast.forEach(x => {
            const span = document.createElement('span');
            span.classList.add('upcoming');
            span.innerHTML = `<span class="symbol">${weatherSymbols[x.condition]}</span>
                              <span class="forecast-data">${x.low}${weatherSymbols.Degrees}/${x.high}${weatherSymbols.Degrees}</span>
                              <span class="forecast-data">${x.condition}</span>`;

            divUpcomingForecast.appendChild(span);
        });

        divUpcoming.appendChild(divUpcomingForecast);

        divForecast.appendChild(divCurrent);
        divForecast.appendChild(divUpcoming);
    }
    catch (error) {
        divForecast.textContent = error.message;
    }
}

async function getCurrentForecast(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/today/${code}`;

    const response = await fetch(url);

    const body = await response.json();

    return body;
}

async function getUpcomingForecast(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;

    const response = await fetch(url);

    const body = await response.json();

    return body;
}

async function getLocationCode(name) {
    const url = 'http://localhost:3030/jsonstore/forecaster/locations';

    const response = await fetch(url);

    const body = await response.json();

    const location = body.find(x => x.name.toLowerCase() == name.toLowerCase());

    if (location == undefined) {
        throw new Error('Error');
    }

    return location.code;
}

attachEvents();