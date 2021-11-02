function solve() {
    const info = document.querySelector('#info span');
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');

    const stopId = {
        name: '',
        next: 'depot'
    }

    async function depart() {
        const url = `http://localhost:3030/jsonstore/bus/schedule/${stopId.next}`;

        try {
            const response = await fetch(url);

            if (response.status != 200) {
                throw new Error('Error');
            }

            const body = await response.json();

            info.textContent = `Next stop ${body.name}`;
            stopId.next = body.next;
            stopId.name = body.name;

            departBtn.disabled = true;
            arriveBtn.disabled = false;
        }
        catch (error) {
            info.textContent = error.message;
        }
    }

    async function arrive() {
        info.textContent = `Arriving at ${stopId.name}`;

        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();