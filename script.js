function getTimeBeforNY() {
  let newYear = new Date("2026-01-01");

  let timer = newYear - Date.now();

  let hours = Math.floor(timer / (60 * 60 * 1000));
  let minutes = Math.floor((timer - hours * (60 * 60 * 1000)) / (60 * 1000));
  let secs = Math.floor(
    (timer - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000
  );

  let xxx = `${hours}:${minutes}:${secs}`;

  const root = document.getElementById("root");

  //   root.setAttribute("class", "red");

  root.textContent = xxx;
}

// getTimeBeforNY();

// alert(getTimeBeforNY());

setInterval(getTimeBeforNY, 1000);
