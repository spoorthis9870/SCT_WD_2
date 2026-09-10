let startTime = 0;
let elapsedTime = 0;
let timer = null;

let lastLapTime = 0;
let lapTimes = [];

const display = document.getElementById("display");
const laps = document.getElementById("laps");
const statusText = document.getElementById("status");

function formatTime(time) {

    let hours = Math.floor(time / 3600000);

    let minutes = Math.floor(
        (time % 3600000) / 60000
    );

    let seconds = Math.floor(
        (time % 60000) / 1000
    );

    let milliseconds = Math.floor(
        (time % 1000) / 10
    );

    return `${String(hours).padStart(2, "0")}:` +
           `${String(minutes).padStart(2, "0")}:` +
           `${String(seconds).padStart(2, "0")}.` +
           `${String(milliseconds).padStart(2, "0")}`;
}


function updateDisplay() {

    elapsedTime = Date.now() - startTime;

    display.textContent = formatTime(elapsedTime);
}


/* START / PAUSE */

document.getElementById("start").onclick = function () {

    if (timer === null) {

        startTime = Date.now() - elapsedTime;

        timer = setInterval(updateDisplay, 10);

        this.textContent = "⏸ Pause";

        statusText.textContent = "Running";

    } else {

        clearInterval(timer);

        timer = null;

        this.textContent = "▶ Resume";

        statusText.textContent = "Paused";
    }
};


/* LAP */

document.getElementById("lap").onclick = function () {

    if (timer === null) {
        return;
    }

    let currentLap = elapsedTime - lastLapTime;

    lastLapTime = elapsedTime;

    lapTimes.push(currentLap);

    let lap = document.createElement("div");

    lap.className = "lap";

    lap.innerHTML = `
        <span class="lap-number">
            Lap ${lapTimes.length}
        </span>

        <span>
            ${formatTime(currentLap)}
        </span>

        <span>
            Total: ${formatTime(elapsedTime)}
        </span>
    `;

    laps.prepend(lap);

    updateStatistics();
};


/* STATISTICS */

function updateStatistics() {

    if (lapTimes.length === 0) {
        return;
    }

    let fastest = Math.min(...lapTimes);

    let slowest = Math.max(...lapTimes);

    let total = lapTimes.reduce(
        (sum, time) => sum + time,
        0
    );

    let average = total / lapTimes.length;

    document.getElementById("fastest").textContent =
        formatTime(fastest);

    document.getElementById("average").textContent =
        formatTime(average);

    document.getElementById("slowest").textContent =
        formatTime(slowest);
}


/* RESET */

document.getElementById("reset").onclick = function () {

    clearInterval(timer);

    timer = null;

    startTime = 0;

    elapsedTime = 0;

    lastLapTime = 0;

    lapTimes = [];

    display.textContent = "00:00:00.00";

    statusText.textContent = "Ready";

    document.getElementById("start").textContent =
        "▶ Start";

    laps.innerHTML = "";

    document.getElementById("fastest").textContent = "--";

    document.getElementById("average").textContent = "--";

    document.getElementById("slowest").textContent = "--";
};


/* CLEAR LAPS */

document.getElementById("clearLaps").onclick = function () {

    lapTimes = [];

    lastLapTime = elapsedTime;

    laps.innerHTML = "";

    document.getElementById("fastest").textContent = "--";

    document.getElementById("average").textContent = "--";

    document.getElementById("slowest").textContent = "--";
};


/* DARK / LIGHT MODE */

document.getElementById("themeBtn").onclick = function () {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        this.textContent = "☀️";

    } else {

        this.textContent = "🌙";
    }
};


/* EXPORT CSV */

document.getElementById("exportBtn").onclick = function () {

    if (lapTimes.length === 0) {

        alert("No lap records to export!");

        return;
    }

    let csv = "Lap,Lap Time,Total Time\n";

    lapTimes.forEach((lap, index) => {

        let total = lapTimes
            .slice(0, index + 1)
            .reduce((sum, time) => sum + time, 0);

        csv += `${index + 1},${formatTime(lap)},${formatTime(total)}\n`;
    });

    let blob = new Blob([csv], {
        type: "text/csv"
    });

    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");

    link.href = url;

    link.download = "stopwatch-laps.csv";

    link.click();

    URL.revokeObjectURL(url);
};


/* KEYBOARD SHORTCUTS */

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        event.preventDefault();

        document.getElementById("start").click();
    }

    if (event.key.toLowerCase() === "l") {

        document.getElementById("lap").click();
    }

    if (event.key.toLowerCase() === "r") {

        document.getElementById("reset").click();
    }
});