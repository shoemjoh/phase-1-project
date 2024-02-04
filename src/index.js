// COMMIT ABOUT 30 TIMES DURING THIS PROJECT, PRESENT TENSE

document.addEventListener("DOMContentLoaded", () => {

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
        <h4>${destination.name}<h4>
    </div>
    `
        // Add city tile to DOM
        document.querySelector('#destination-list').appendChild(tile)

        console.log(tile);
    }
    getDestinations();
});

