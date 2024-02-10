// COMMIT ABOUT 30 TIMES DURING THIS PROJECT, PRESENT TENSE

document.addEventListener("DOMContentLoaded", () => {
    // Grab some of the html:
    const destinationForm = document.querySelector(".add-destination-form")
    const deleteBtn = document.querySelector(".delete-button")

    // EVENT LISTENER: Submit event on the destination form.
    destinationForm.addEventListener('submit', handleReviewEvent)

    // Handle a form submission event.
    function handleReviewEvent(e) {
        e.preventDefault();
        let destinationObj = {
            destination: e.target.destination.value,
            hotels: [
                {
                    hotel: e.target.hotel.value,
                    notes: e.target.hotelnotes.value
                }
            ]
            ,
            restaurants: [
                {
                    restaurant: e.target.restaurant.value,
                    notes: e.target.restaurantnotes.value
                }
            ],
            day: [
                {
                    activity: e.target.day.value,
                    notes: e.target.daynotes.value
                }
            ],
            night: [
                {
                    activity: e.target.night.value,
                    notes: e.target.nightnotes.value
                }
            ]
        }

        fetch('http://localhost:3000/destinations')
            .then(res => res.json())
            .then(data => {
                const existingDestination = data.find(dest => dest.destination === destinationObj.destination);
                console.log(existingDestination)
                if (existingDestination) {
                    // Destination exists, update existing object
                    console.log("destination exists")

                    // Create a copy of the existing destination to avoid modifying the original.
                    const updatedDestination = { ...existingDestination }

                    // Update hotels with new ones from the form
                    updatedDestination.hotels.push(...destinationObj.hotels)

                    // Update restaurants with new ones from the form
                    updatedDestination.restaurants.push(...destinationObj.restaurants)

                    // Update day activities with new ones from the form
                    updatedDestination.day.push(...destinationObj.day)

                    // Update night activities with new ones from the form
                    updatedDestination.night.push(...destinationObj.night)

                    fetch(`http://localhost:3000/destinations/${existingDestination.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedDestination) // Merge properties
                    })
                        .then(res => res.json())
                        .then(updatedDestination => {
                            // Update the tile in the DOM if needed
                            //const tileToUpdate = document.querySelector(`.tile[data-id="${existingDestination.id}"]`);
                            //if (tileToUpdate) {
                            //    // ... (update tile content with new information)
                            //}
                            console.log("Destination updated:", updatedDestination);
                        });
                } else {
                    // Destination doesn't exist, create a new one
                    console.log("destination doesn't exist")
                    renderOneDestination(destinationObj)
                    addNewDestination(destinationObj);
                }
                destinationForm.reset();
            });


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
        <button class="delete-button"> __ </button>
    </div>
    `
        // Allow for delete button.
        tile.querySelector(".delete-button").addEventListener('click', () => {
            tile.remove()
            deleteDestination(destination.id)
        })
        // Add city tile to DOM
        document.querySelector('#destination-list').appendChild(tile)
        console.log(tile);

        tile.addEventListener('mouseover', () => {
            tile.style.backgroundColor = 'red';
        })
        tile.addEventListener('mouseleave', () => {
            tile.style.backgroundColor = 'inherit';
        })

    }
    // Pulls the destinations onto the page once the DOM loads.
    getDestinations();

    function deleteDestination(id) {
        fetch(`http://localhost:3000/destinations/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application / json'

            }
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }
})


