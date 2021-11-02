async function getInfo() {
    const stopId = document.getElementById('stopId');
    const stopName = document.getElementById('stopName');
    const buses = document.getElementById('buses');

    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId.value}`;

    stopId.value = '';
    stopName.textContent = 'Loading...';
    buses.innerHTML = '';

    try {
        const response = await fetch(url);

        if (response.status != 200) {
            throw new Error('Error');
        }

        const body = await response.json();

        stopName.textContent = body.name;

        Object.entries(body.buses).forEach(x => {
            const li = document.createElement('li');
            li.textContent = `Bus ${x[0]} arrives in ${x[1]} minutes`;

            buses.appendChild(li);
        })
    }
    catch (error) {
        stopName.textContent = error.message;
    }
}