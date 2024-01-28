// COMMIT ABOUT 30 TIMES DURING THIS PROJECT, PRESENT TENSE

document.addEventListener("DOMContentLoaded", () => getDestinations())
// Do we want to immediately invoke fetchData there.

// Using mock backend using db.json server instead of remote API.
function getDestinations() {
    console.log("get destinations")
    fetch('http://localhost:3000/destinations')
        .then((resp) => resp.json())
        // Parse with json method
        .then((data) => console.log(data))
    // Open index.html to see datastructure in console. Make second commit "working fetch" git add ., git commit -m "", git push
}