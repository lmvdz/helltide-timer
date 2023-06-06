function hrTohhmmss(decimalTimeString){
    var decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * 60 * 60;
    var hours = Math.floor((decimalTime / (60 * 60)));
    decimalTime = decimalTime - (hours * 60 * 60);
    var minutes = Math.floor((decimalTime / 60));
    decimalTime = decimalTime - (minutes * 60);
    var seconds = Math.round(decimalTime);
    if(hours < 10)
    {
        hours = "0" + hours;
    }
    if(minutes < 10)
    {
        minutes = "0" + minutes;
    }
    if(seconds < 10)
    {
        seconds = "0" + seconds;
    }
    return "" + hours + ":" + minutes + ":" + seconds
}

const recordedHelltideStart = 1686056400000;
const helltideTime = 60 * 60 * 1000; // 1hr
const helltideCooldown = 75 * 60 * 1000; // 1hr 15min

setInterval(() => {
    var now = new Date()
    var since = now - recordedHelltideStart;
    var timeleft = 0;
    var onCooldown = false

    while (since > 0) {
        since -= (helltideTime)
        onCooldown = false;
        if (since > 0) {
            since -= helltideCooldown
            onCooldown = true;
        }
    }
    timeleft = Math.abs(since)
    // const end = new Date(now.getTime() +  timeleft);
    document.getElementById('timer').innerHTML = `
        <p id="status">Helltide is ${onCooldown ? '<strong>over</strong>' : '<strong>active</strong>'}</p>
        <p id="counter"><span id="counterTime">${hrTohhmmss(timeleft / 1000 / 60 / 60)}</span></p>
    `
}, 1000)

const checkbox = document.getElementById("checkbox")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark")
})
