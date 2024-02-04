// COMMIT ABOUT 30 TIMES DURING THIS PROJECT, PRESENT TENSE

document.addEventListener("DOMContentLoaded", () => {
    // Grab some of the html:
    const destinationForm = document.querySelector(".add-destination-form")

    // EVENT LISTENER: Submit event on the destination form.
    destinationForm.addEventListener('submit', handleReviewEvent)

    // Handle a form submission event.
    function handleReviewEvent(e) {
        e.preventDefault();
        let destinationObj = {
            destination: e.target.destination.value,
            hotels: {
                hotel: e.target.hotel.value,
                notes: e.target.hotelnotes.value
            },
            restaurants: e.target.restaurant.value,
            day: e.target.day.value,
            night: e.target.night.value
        }
        console.log(destinationObj)
        renderOneDestination(destinationObj)
        addNewDestination(destinationObj)
    }

    function addNewDestination(destinationObj) {
        fetch('http://localhost:3000/destinations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(destinationObj)
        })
            .then(res => res.json())
            .then(data => console.log(data))

    }

    // Using mock backend using db.json server instead of remote API.
    function getDestinations() {
        console.log("get destinations")
        // Grab html element where we want to display the server request.

        // HTTP GET request to local server
        // Run json-server --watch db.json in the terminal
        fetch('http://localhost:3000/destinations')
            .then((resp) => resp.json())
            // Parse with json method
            .then((data) => {
                initializeDestinations(data)
            })
    }
    // Render each of our destinations to the DOM
    function initializeDestinations(data) {
        console.log()
        data.forEach(destination => renderOneDestination(destination))
    }

    // DOM Render Functions
    function renderOneDestination(destination) {
        // Build city tile, line up to CSS style names for tile
        let tile = document.createElement('li')
        tile.className = 'tile'
        tile.innerHTML = `
    <div>
        <h4>${destination.destination}<h4>
    </div>
    `
        // Add city tile to DOM
        document.querySelector('#destination-list').appendChild(tile)

        console.log(tile);
    }
    // Pulls the destinations onto the page once the DOM loads.
    getDestinations();


});

