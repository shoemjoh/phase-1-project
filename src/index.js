// COMMIT ABOUT 30 TIMES DURING THIS PROJECT, PRESENT TENSE

// Let the DOM content load before running any functions.
document.addEventListener("DOMContentLoaded", () => {
    // Grab the html destination form and the delete buttons on each tile:
    const destinationForm = document.querySelector(".add-destination-form")
    const deleteBtn = document.querySelector(".delete-button")

    // EVENT LISTENER: Submit event on the destination form. Call handleReviewEvent which takes the inputs from the form and:

    // Handle Review Event function
    // 1. Creates a new destination object to push the input values to (if they exist).
    // 2. Fetches the data stored in the db.json.
    // 3. Checks the new destination obj "destination (city)" to see if it exists in the json database already. Uses the array method "find" to search for where the destination may exist in an object in the array.
    // 4. Sets the variable existing destination equal to the object that is found.
    // 5. Then makes a copy of the existing destination calls it 'updated destination'.
    // 6. Next, it pushes a copy of the input values of the form, stored in destinationObj, to the updated destination object.
    // 7. It does this for hotels, restaurants, day activities, and night activities.
    // 8. It then takes the Updated Destination Obj and calls a PUT request to the json server. Fetch with the filepath referencing the existing destination's id in the URL, method, headers, body. Then res and res.jsonify(), then the updated object and pass it to a callback function which just logs it. It seems the difference between POST and PUT is whether you are updating or adding a new object to the array.
    // 9. If it's NOT an existing destination, it calls the addNewDestination function, with the destinationObj as the parameter.

    // Add new destintation function.
    // 1. Takes the destinationObj created by the form submission (we know it's a new destination) and POSTs it to the database.
    // 2. Which then sends a response (promise), which we take and call the .json() method and then pass the json data into a callback function that calls renderOneDestination.

    // Render a new destination to the DOM.
    // 1. Takes the new destinationObj as a parameter. 
    // 2. Creates a list item element; we store it as a tile. Give it a class name of tile.
    // 3. Set the innerHMTL to be the destination name (destination.destination) and add a delete button with a class of delete button.
    // 4. Add an Event Listener to the delete button. LIKELY WANT TO ADD AN "ARE YOU SURE? " pop-up. This calls the deleteDestination function.
    // 5. Add the destination tile to the DOM by grabbing the <div> area called destination list and appending the list item "tile" as a child to the area.
    // 6. Add a mouseover event listener to the tiles, this creates a color-changing affect when the user hovers over the tile. A second event listener inherits the background color when the mouse leaves the tile.
    // 7. Finally, adds a click event listener to each tile. When the tile is clicked, the pullDestinationList is called.


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
        // Calls the stored destinations.
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
                location.reload();
            });
    }
    // Is called when a new destination is added in the form.
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
        // Build destination tile, line up to CSS style names for tile
        let tile = document.createElement('li')
        tile.className = 'tile'
        tile.innerHTML = `
    <div>
        <h4>${destination.destination}<h4>
        <button class="delete-button">-</button>
        <button class="addto-button">+</button>
    </div>
    `
        // Allow for delete button.
        tile.querySelector(".delete-button").addEventListener('click', () => {
            // tile.remove()
            deleteDestination(tile, destination.id)
        })
        // Allow for Add To Destination button.
        tile.querySelector(".addto-button").addEventListener('click', () => {
            const destinationText = destination.destination;
            const destinationInput = document.getElementById('destinations');
            destinationInput.value = destinationText;
            destinationInput.focus(); // Move focus to the destination field
        })

        // Add city tile to DOM
        document.querySelector('#destination-list').appendChild(tile)
        console.log(tile);
        // Style the tiles.
        tile.addEventListener('mouseover', () => {
            //const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
            tile.style.backgroundColor = "gold";
        })
        tile.addEventListener('mouseleave', () => {
            tile.style.backgroundColor = 'inherit';
        })

        tile.addEventListener('click', () => {
            pullDestinationList(destination.id)
        })
    }
    // Called when the delete button on the tile is clicked.
    function deleteDestination(tile, id) {

        const confirmed = window.confirm("Are you sure you want to delete this destination?");
        if (confirmed) {
            tile.remove()
            fetch(`http://localhost:3000/destinations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application / json'

                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    // Reload the page after deletion.
                    location.reload();

                })
        }
    }
    // Shares the list of stored data for a specific destination.
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
                data.hotels.forEach((hotel, index) => {
                    hotelList += `<li><b>${hotel.hotel}</b>: ${hotel.notes} <button class="delete-btn" data-hotel-index="${index}" data-destination-id="$${id}">-</button> </li>`;
                    // Iterate through each restaurant in the data object.
                })
                data.restaurants.forEach(restaurant => {
                    restaurantList += `<li><b>${restaurant.restaurant}</b>: ${restaurant.notes}</li>`;
                })
                // Iterate through each day notes in the data object.
                data.day.forEach(d => {
                    dayList += `<li><b>${d.activity}</b>: ${d.notes}</li>`;
                })
                // Iterate through each restaurant in the data object.
                data.night.forEach(n => {
                    nightList += `<li><b>${n.activity}</b>: ${n.notes}</li>`;
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

    function deleteHotelItem(hotelIndex, destinationID) {
        console.log(`Deleting hotel at index ${hotelIndex} for destination ${destinationID}.`)
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
})


