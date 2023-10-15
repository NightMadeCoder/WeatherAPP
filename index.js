const apiKey = "dee9f7a6ddf53108919159ced9ec076d";
const parentEL = document.querySelector(".flexBody");
const searchBar = document.querySelector(".searchBar");
const submit = document.querySelector(".submit");
const errorMsg = document.querySelector(".errorMsg");
const repeatCityMsg = document.querySelector(".repeatCityMsg");

let searchedCities = [];

const getPosition = async function () {
  try {
    const dataPos = await new Promise(function (resolve, reject) {
      window.navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    if (!dataPos) {
      errorMsg.classList.remove("hidden");

      throw new Error(`location not found`);
    }
    errorMsg.classList.add("hidden");
    const { latitude, longitude } = dataPos.coords;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );

    if (!res.ok) {
      errorMsg.classList.remove("hidden");
      throw new Error(`error getting weather data`);
    }
    errorMsg.classList.add("hidden");
    const data = await res.json();
    const { name } = data;
    const { description, icon } = data.weather[0];
    let { temp } = data.main;
    temp -= 273.15;

    const parameters = {
      name,
      description,
      icon,
      temp,
    };

    return parameters;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
  }
};
const renderError = function () {};
const getWeather = async function (city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      errorMsg.classList.remove("hidden");
      throw new Error(`please check for a valid city`);
    }
    errorMsg.classList.add("hidden");
    const data = await res.json();
    const { name } = data;
    const { description, icon } = data.weather[0];
    const { temp } = data.main;

    const parameters = {
      name,
      description,
      icon,
      temp,
    };

    return parameters;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);

    throw err;
  }
};

const init = async function () {
  try {
    const city = await getPosition();

    render(city);
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
  }
};
const render = function (data) {
  const html = `
  <div class="card">
  <div class="cardItems">
    <p class="name">${data.name}</p>
    <h3 class="temp">${Math.round(data.temp)}°C</h3>
    <p class="cloudIcon"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
  data.icon
}.svg" alt="" /></p>
    <p class="weather">${data.description}</p>
  </div>
</div>
    `;
  parentEL.insertAdjacentHTML("afterbegin", html);
};

init();

submit.addEventListener("click", function (e) {
  e.preventDefault();
  search();
});
const search = async function () {
  try {
    if (searchBar.value == "") return;

    const city = searchBar.value.toLowerCase();
    searchBar.value = "";
    if (searchedCities.includes(city)) {
      repeatCityMsg.classList.remove("hidden");
      return;
    }
    repeatCityMsg.classList.add("hidden");
    const data = await getWeather(city);
    searchedCities.push(city);
    render(data);
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
  }
};
