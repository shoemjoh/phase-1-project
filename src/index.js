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
            hotels: [],
            restaurants: [],
            day: [],
            night: []
        };

        // Check for values.
        if (e.target.hotel.value) {
            destinationObj.hotels.push({
                hotel: e.target.hotel.value,
                notes: e.target.hotelnotes.value
            })
        }
        if (e.target.restaurant.value) {
            destinationObj.restaurants.push({
                restaurant: e.target.restaurant.value,
                notes: e.target.restaurantnotes.value
            })
        }
        if (e.target.day.value) {
            destinationObj.day.push({
                activity: e.target.day.value,
                notes: e.target.daynotes.value
            })
        }
        if (e.target.night.value) {
            destinationObj.night.push({
                activity: e.target.night.value,
                notes: e.target.nightnotes.value
            })
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
            .then(data => {
                console.log(data)
                renderOneDestination(data)
            })

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
            tile.style.backgroundColor = 'green';
        })
        tile.addEventListener('mouseleave', () => {
            tile.style.backgroundColor = 'inherit';
        })

        tile.addEventListener('click', () => {
            pullDestinationList(destination.id)
        })

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
            .then(data => {
                console.log(data)

            })
    }

    function pullDestinationList(id) {
        console.log(id)

        fetch(`http://localhost:3000/destinations/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Destination details:", data)
                let hotelList = "";
                let restaurantList = "";
                let dayList = "";
                let nightList = "";

                // Iterate through each hotel in the data object.
                data.hotels.forEach(hotel => {
                    hotelList += `<li>${hotel.hotel}: ${hotel.notes}</li>`;
                })
                // Iterate through each restaurant in the data object.
                data.restaurants.forEach(restaurant => {
                    restaurantList += `<li>${restaurant.restaurant}: ${restaurant.notes}</li>`;
                })
                // Iterate through each day notes in the data object.
                data.day.forEach(d => {
                    dayList += `<li>${d.activity}: ${d.notes}</li>`;
                })
                // Iterate through each restaurant in the data object.
                data.night.forEach(n => {
                    nightList += `<li>${n.activity}: ${n.notes}</li>`;
                })

                let logElement = document.querySelector('#destination-log');
                logElement.innerHTML = `
                <h2>${data.destination}</h2>
                <h3> Hotels </h3>
               <ul>
               ${hotelList}
               </ul>
               <h3> Restaurants </h3>
               <ul>
               ${restaurantList}
               </ul>
               <h3> Day Activities </h3>
               <ul>
               ${dayList}
               </ul>
               <h3> Night Activities </h3>
               <ul>
               ${nightList}
               </ul>
                `;


            })

    }
})


