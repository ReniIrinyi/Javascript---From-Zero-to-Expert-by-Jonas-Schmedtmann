"use strict";
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//237.Refactoring Project Architecture
class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 50;

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("Could not get your position");
      }
    );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 17);

    L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));

    //render the marker from local Storage (!!after the map was loading)
    this.#workouts.forEach((el) => this._renderWorkoutMarker(el));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  //hide form + input fields
  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        "";
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => {
      form.style.display = "grid";
    }, 1000);
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();
    //239 Creating new Workout

    //Get data from form
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const type = inputType.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    //Check if data(...x) is valid (x > 0 ; x = number)
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp) && inp > 0);

    //If type="running/cycling" => create running/cycling object
    if (type === "running") {
      const cadence = +inputCadence.value;
      workout = new Running([lat, lng], distance, duration, cadence);
      //add new object to workout array
      this.#workouts.push(workout);

      if (!validInputs(distance, duration, cadence)) {
        return alert("Inputs have to be positive numbers!");
      }
    }

    if (type === "cycling") {
      const elevation = +inputElevation.value;
      workout = new Cycling([lat, lng], distance, duration, elevation);
      //add new object to workout array
      this.#workouts.push(workout);
      if (!validInputs(distance, duration, elevation)) {
        return alert("Inputs have to be positive numbers!");
      }
    }
    console.log(this.#workouts);

    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    this._hideForm();
    this._setLocalStorage();
  }
  //240. render workout on list
  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
      } </span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;

    if (workout.type === "running") {
      html += `<div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence}</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>`;
    }

    if (workout.type === "cycling") {
      html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.speed.toFixed(1)}</span>
    <span class="workout__unit">km/h</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${workout.elevGain}</span>
    <span class="workout__unit">m</span>
  </div>
</li> `;
    }

    form.insertAdjacentHTML("afterend", html);
  }
  //render workout on map as marker
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        ` ${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }
  //241 Move to Marker on Click => Event deegation => parent-re
  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");

    if (!workoutEl) return;
    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    //using public interface
    // workout.click();
  }

  //242 Working with local Storage (key-value Store, but just for small application because of Blocking!)
  //JSON.stringify => konvert an object to a string
  _setLocalStorage() {
    //takes 2 strings as arguments
    localStorage.setItem("workout", JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    //ez mind string => visszssa kell konvertálni JSON parse-al

    const data = JSON.parse(localStorage.getItem("workout"));
    console.log(data);

    if (!data) return;
    this.#workouts = data;
    this.#workouts.forEach((el) => this._renderWorkout(el));
  }

  //FONTOS ha az objectet elöször Stringbe konvertáljuk,majd vissza
  //Objectbe akkor a prototype chain elveszlik!

  reset() {
    localStorage.removeItem("workout");
    location.reload();
  }
}

const app = new App();

//238 Managing Workout Data: Creating Classes
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  type = inputType.value;
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords; //[lat, lng]
    this.distance = distance; //km
    this.duration = duration; //min
  }

  _setDescription() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this._calcPace();
    this._setDescription();
  }
  _calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevGain) {
    super(coords, distance, duration);
    this.elevGain = elevGain;
    this._calcSpeed();
    this._setDescription();
  }

  _calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
