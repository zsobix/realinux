function updateTime(){
    var label = document.getElementById("time")
    var time = new Date().toLocaleString()
    label.innerHTML = time
}
setInterval(updateTime, 1000)