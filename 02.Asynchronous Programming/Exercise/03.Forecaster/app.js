function attachEvents() {
    document.getElementById('submit').addEventListener('click', getForecast);
}

async function getForecast() {
    const divForecast = document.getElementById('forecast');
    divForecast.style.display = '';

    const weatherSymbols = {
        'Sunny': '&#x2600',
        'Partly sunny': '&#x26C5',
        'Overcast': '&#x2601',
        'Rain': '&#x2614',
        'Degrees': '&#176'
    }

    const divCurrent = document.querySelector('#current .label');
    const divUpcoming = document.querySelector('#upcoming .label');

    try {
        const code = await getLocationCode(document.getElementById('location').value);

        const [current, upcoming] = await Promise.all([
            getCurrentForecast(code),
            getUpcomingForecast(code)
        ]);
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

    console.log(location)
}

attachEvents();