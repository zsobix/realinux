const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
var maxzIndex = 1;


function updateTime(){
    var label = document.getElementById("time")
    var date = new Date()
    label.innerHTML = `<i class="fa-solid fa-clock"></i> ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} <i class="fa-solid fa-calendar"></i> ${months[date.getMonth()]} ${String(date.getDate())}, ${String(date.getFullYear())}  <a href="https://zsobix.xyz"><i class="fa-solid fa-power-off"></i></a>`
}
updateTime()
setInterval(updateTime, 1000)

// Make the DIV element draggable:
dragElement(document.getElementById("starwindow"));
dragElement(document.getElementById("weatherwindow"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var windows = document.getElementsByClassName("window")

for (let i = 0; i < windows.length; i++) {
    windows[i].onmouseover = function(){
        console.log(windows[i])
        maxzIndex++
        windows[i].style.zIndex = maxzIndex
        document.getElementById("topheader").style.zIndex = maxzIndex + 1;
        document.getElementById("center").innerHTML = String(windows[i].id)
    }
}

var close = document.getElementsByClassName("headerclose")

for (let i = 0; i < close.length; i++) {
  close[i].onclick = function(){
      close[i].parentElement.parentElement.style.display = "none"
  }
}

var shortcuts = document.getElementsByClassName("shortcut")

for (let i = 0; i < shortcuts.length; i++) {
  shortcuts[i].onclick = function(){
      document.getElementById(shortcuts[i].id.replace("shortcut", "")).style.display = "block"
      maxzIndex++
      shortcuts[i].id.replace("shortcut", "").style.zIndex = maxzIndex
      document.getElementById("topheader").style.zIndex = maxzIndex + 1;
  }
}

const getDirection = function getDirection(angle) {
    // Source - https://stackoverflow.com/a/48750814
    // Posted by VisioN, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-07-19, License - CC BY-SA 4.0 

    var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index]
}
function success(pos) {
    const crd = pos.coords;

    console.log(`Latitude: ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${crd.latitude}&longitude=${crd.longitude}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,is_day,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m&forecast_days=1`)
        .then(response => {response.json().then((jsonResponse) => {
            console.log(jsonResponse)
            var obj = jsonResponse;
            document.getElementById("weather").innerHTML = `<i class="fa-solid fa-cloud-sun"></i> ${obj.current.temperature_2m}°C (feels like ${obj.current.apparent_temperature}°C), <br>
            max ${obj.daily.temperature_2m_max[0]}°C, min ${obj.daily.temperature_2m_min[0]}°C<br>
            <i class="fa-solid fa-wind"></i> ${obj.current.wind_speed_10m} km/h from ${getDirection(obj.current.wind_direction_10m)}<br>
            <i class="fa-solid fa-cloud-rain"></i> ${obj.current.precipitation} mm (approximately)`
        })})
}

function error(err) {
    document.getElementById("weather").innerHTML = `<i class="fa-solid fa-cloud-sun"></i> ERROR: <br> ${err.message} <br>`
}

window.navigator.geolocation.getCurrentPosition(success, error, {"maximumAge": Infinity, "timeout": 60000, "enableHighAccuracy": false}) 


if (localStorage.getItem("username") != null) {
    var username = localStorage.getItem("username");
    console.log(username)
    console.log(username != null)
    fetch(`https://stardance.jam06452.uk/api/v2/users/${username}/projects?limit=100`)
        .then(response => {
            if (response.ok) {
                response.json().then((jsonResponse) => {
                    console.log(jsonResponse)
                    var obj = jsonResponse;
                    var maxhours = 0;
                    var maxdevlogs = 0;
                    var maxfollowers = 0;
                    for (let i = 0; i < obj.projects.length; i++) {
                        var hours = parseInt(obj.projects[i].total_hours)
                        maxhours = hours+maxhours
                        var devlogs = parseInt(obj.projects[i].devlog_count)
                        maxdevlogs = devlogs+maxdevlogs
                        var followers = parseInt(obj.projects[i].followers)
                        maxfollowers = followers+maxfollowers
                    }
                    document.getElementById("stardance").innerHTML = `<i class="fa-solid fa-star"></i> Stardance Stats:<br>
                    <i class="fa-solid fa-book"></i> Total devlogs: ${maxdevlogs}<br>
                    <i class="fa-solid fa-user-plus"></i> Total followers (across all projects): ${maxfollowers}<br>
                    <i class="fa-regular fa-clock"></i> Total hours: ${maxhours} h`
                    document.getElementById("error01").style.display = "none"
                    document.getElementById("error02").style.display = "none"
                    localStorage.setItem("username", username)
            })
            } else {
                document.getElementById("error01").style.display = "block"
            }
        })
}

document.getElementById("starsave").onclick = function(){
    var username = document.getElementById("starinput").value;
    if (username == "") {
        document.getElementById("error02").style.display = "block"
    } else {
        fetch(`https://stardance.jam06452.uk/api/v2/users/${username}/projects?limit=100`)
            .then(response => {
                if (response.ok) {
                    response.json().then((jsonResponse) => {
                        console.log(jsonResponse)
                        var obj = jsonResponse;
                        var maxhours = 0;
                        var maxdevlogs = 0;
                        var maxfollowers = 0;
                        for (let i = 0; i < obj.projects.length; i++) {
                            var hours = parseInt(obj.projects[i].total_hours)
                            maxhours = hours+maxhours

                            var devlogs = parseInt(obj.projects[i].devlog_count)
                            maxdevlogs = devlogs+maxdevlogs

                            var followers = parseInt(obj.projects[i].followers)
                            maxfollowers = followers+maxfollowers
                        }
                        document.getElementById("stardance").innerHTML = `<i class="fa-solid fa-star"></i> Stardance Stats:<br>
                        <i class="fa-solid fa-book"></i> Total devlogs: ${maxdevlogs}<br>
                        <i class="fa-solid fa-user-plus"></i> Total followers (across all projects): ${maxfollowers}<br>
                        <i class="fa-regular fa-clock"></i> Total hours: ${maxhours} h`
                        document.getElementById("error01").style.display = "none"
                        document.getElementById("error02").style.display = "none"
                })
                localStorage.setItem("username", username)
                document.getElementById("starinput").value = ""
                } else {
                    document.getElementById("error01").style.display = "block"
                }
            })
    }
}