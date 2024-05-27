
// Let the DOM content load before running any functions.
document.addEventListener("DOMContentLoaded", () => {
    // Grab the html destination form and the delete buttons on each tile:
    const destinationForm = document.querySelector(".add-destination-form")
    const deleteBtn = document.querySelector(".delete-button")
    const addReviewBtn = document.getElementById("new-review-btn")
    const reviewFormContainer = document.querySelector(".container")

    addReviewBtn.addEventListener('click', () => {
        reviewFormContainer.style.display = "block"
    })

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
                            console.log("Destination updated:", updatedDestination);
                        });
                } else {
                    // Destination doesn't exist, create a new one
                    console.log("destination doesn't exist")
                    addNewDestination(destinationObj);

                }
                destinationForm.reset();
                reviewFormContainer.style.display = "none";
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
        <h4>${destination.destination}</h4>
        <button class="delete-button">-</button>
        <button class="addto-button">+</button>
    </div>
    `
        // Allow for delete button.
        tile.querySelector(".delete-button").addEventListener('click', () => {
            deleteDestination(tile, destination.id)
        })
        // Allow for Add To Destination button.
        tile.querySelector(".addto-button").addEventListener('click', () => {
            reviewFormContainer.style.display = "block"
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
            tile.style.backgroundColor = "#993246";
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
        console.log(`Destination: ${id}`)
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
                    hotelList += `<li id=hotel-${index}><b>${hotel.hotel}</b>: ${hotel.notes} <button class="d-btn" data-hotel-index=${index} data-destination-index=${id}>-</button></li>`;
                })
                // Iterate through each restaurant in the data object.
                data.restaurants.forEach((restaurant, index) => {
                    restaurantList += `<li id=restaurant-${index}><b>${restaurant.restaurant}</b>: ${restaurant.notes} <button class="d-btn" data-restaurant-index=${index} data-destination-index=${id}>-</button></li>`;
                })
                // Iterate through each day notes in the data object.
                data.day.forEach((d, index) => {
                    dayList += `<li id=day-${index}><b>${d.activity}</b>: ${d.notes} <button class="d-btn" data-day-index=${index} data-destination-index=${id}>-</button></li>`;
                })
                // Iterate through each night in the data object.
                data.night.forEach((n, index) => {
                    nightList += `<li id=night-${index}><b>${n.activity}</b>: ${n.notes} <button class="d-btn" data-night-index=${index} data-destination-index=${id}>-</button></li>`;
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

                let deleteArray = Array.from(logElement.querySelectorAll('.d-btn'))
                deleteArray.forEach((btn) => {
                    btn.addEventListener('click', function () {
                        const hotelIndex = this.getAttribute('data-hotel-index');
                        const restaurantIndex = this.getAttribute('data-restaurant-index');
                        const dayIndex = this.getAttribute('data-day-index');
                        const nightIndex = this.getAttribute('data-night-index');
                        const destinationIndex = this.getAttribute('data-destination-index');
                        deleteDestinationItem(hotelIndex, restaurantIndex, dayIndex, nightIndex, destinationIndex)
                    })
                })
                console.log(deleteArray)
                console.log("Updated logElement")
                console.log(`${id} this is the destination we selected!`)

            })
    }



    // Function to delete a hotel entry.
    function deleteDestinationItem(hotelIndex, restaurantIndex, dayIndex, nightIndex, destinationID) {
        const confirmDelete = window.confirm("Are you sure you want to delete this entry?");

        if (confirmDelete) {
            if (hotelIndex) {
                const itemID = `hotel-${hotelIndex}`
                document.getElementById(itemID).remove();
                // Does this GET request need a second parameter?
                fetch(`http://localhost:3000/destinations/${destinationID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(destination => {
                        destination.hotels.splice(hotelIndex, 1);

                        // Send updated destination object back to database.
                        fetch(`http://localhost:3000/destinations/${destinationID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify(destination),
                        })
                            .then(res => res.json())
                            .then(updatedDestination => {
                                console.log('Hotel deleted', updatedDestination)
                            })
                    })
                console.log(`Deleting hotel at index ${hotelIndex} for destination ${destinationID}.`)

            }
            if (restaurantIndex) {
                const itemID = `restaurant-${restaurantIndex}`
                console.log(itemID)
                document.getElementById(itemID).remove();
                fetch(`http://localhost:3000/destinations/${destinationID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(destination => {
                        destination.restaurants.splice(restaurantIndex, 1);

                        // Send updated destination object back to database.
                        fetch(`http://localhost:3000/destinations/${destinationID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify(destination),
                        })
                            .then(res => res.json())
                            .then(updatedDestinationObj => {
                                console.log('Restaurant deleted', updatedDestinationObj)
                            })
                    })
                console.log(`Deleting restaurant at index ${restaurantIndex} for destination ${destinationID}.`)
            }
            if (dayIndex) {
                console.log(`Destination ID when we try to delete a day activity ${destinationID}`)
                const itemID = `day-${dayIndex}`
                document.getElementById(itemID).remove();
                fetch(`http://localhost:3000/destinations/${destinationID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(destination => {
                        destination.day.splice(dayIndex, 1);

                        // Send updated destination object back to database.
                        fetch(`http://localhost:3000/destinations/${destinationID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify(destination),
                        })
                            .then(res => res.json())
                            .then(updatedDestination => {
                                console.log('Day deleted', updatedDestination)
                            })
                    })
                console.log(`Deleting day activity at index ${dayIndex} for destination ${destinationID}.`)
            }
            if (nightIndex) {
                console.log(`Destination ID when we try to delete a night activity ${destinationID}`)
                const itemID = `night-${nightIndex}`
                console.log(`It got to ${nightIndex}`)
                document.getElementById(itemID).remove();
                fetch(`http://localhost:3000/destinations/${destinationID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(destination => {
                        destination.night.splice(nightIndex, 1);

                        // Send updated destination object back to database.
                        fetch(`http://localhost:3000/destinations/${destinationID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify(destination),
                        })
                            .then(res => res.json())
                            .then(updatedDestination => {
                                console.log('Night deleted', updatedDestination)
                            })
                    })
                console.log(`Deleting night activity at index ${nightIndex} for destination ${destinationID}.`)
            }

        }

    }


    // Using mock backend using db.json server instead of remote API.
    function getDestinations() {

        fetch('http://localhost:3000/destinations')
            .then((resp) => resp.json())
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


