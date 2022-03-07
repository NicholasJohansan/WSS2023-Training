
let select = document.querySelector('select#timezone');
let clock = document.querySelector('p#time');
let showTimeButton = document.querySelector('button#show-time');

for (let i = 0; i < 10; i++) {
  select.innerHTML += `
  <option value=${4+i}>
  GMT+${4+i}:00
  </option>
  `;
}

select.value = (new Date()).getTimezoneOffset()/-60;

let time = (new Date()).getTime()-1000;
const updateClock = function() {
  time += 1000;
  let timeString = (new Date(time)).toTimeString().substring(0, 9);
  clock.textContent = timeString;
}

const changeTimezone = function(hourOffset) {
  let hourInMilliseconds = 1000*60*60
  let millisecondsOffset = hourInMilliseconds*hourOffset;
  let localTime = (new Date()).getTime();
  let localTimeOffset = (new Date()).getTimezoneOffset()/-60;
  let UTCTime = localTime-localTimeOffset*hourInMilliseconds;
  time = (new Date(UTCTime + millisecondsOffset)).getTime()-1000;
  console.log(time);
}

showTimeButton.onclick = function() {
  changeTimezone(select.value);
}

updateClock();
setInterval(updateClock, 1000)