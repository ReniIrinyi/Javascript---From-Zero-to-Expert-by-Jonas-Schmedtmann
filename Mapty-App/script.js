"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
let map, mapEvent;

//232. Using Geolocation API

//if navigator exist
if (navigator.geolocation)
  //takes 2 allbacks: 1 ha megvan a koordináta, 2. ha nincs
  navigator.geolocation.getCurrentPosition(
    //takes 1 arguments: position
    function (position) {
      console.log(position); //has 2 argument: latitude: 47.2832594; longitude: 8.0052542

      //take coordinets out of the object
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      const coords = [latitude, longitude]; // a Leaflet kódba kell

      //232. Display Map using Leaflet Libary

      //Leaflet Website/Docs
      //Here we create a map in the 'map' div in HTML,
      // add tiles of our choice, and then add a marker with some text in a popup

      //azért kellett a map variablet csinálni, mert ezen a map objecten tudunk egy event-listenert alkalmazni annak érdekében hogy
      //ha rákkattintunk a map-ra tudja a koordinátákat
      map = L.map("map").setView(coords, 17);

      L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //az on method a Leafletböl jön, olyan mint az addeventlistener a JS-ben. az L-nél megnézhetjük az összes methodot, ott van köztük
      // console.log(map);
      map.on("click", function (mapE) {
        mapEvent = mapE;
        //235. Rendering Workout Input Form 2/1

        //wenn user clicks, show the form
        form.classList.remove("hidden");
        //oda teszi a kurzor fokuszt
        // a formban most nics submit button, ezért ugy kell beállitani az event-listener hogyha entert ütünk akkor legyen a form
        //elfogadva, ezt viszont ezen az event-listeneren kivül tesszük meg
        inputDistance.focus();
      });
    },
    function () {
      alert("Could not get your position");
    }
  );

//235. Rendering Workout Input Form 2/2

//change the type of the input
inputType.addEventListener("change", function () {
  //closest select parents!!
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});

//submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  //Clear inputs
  inputDistance.value =
    inputCadence.value =
    inputDuration.value =
    inputElevation.value =
      "";

  //234. Displaying a Map Marker (with Leaflet Libary)

  //ebben a funkcióba tesszük a markert, mert csak azután jelenjen meg a marker miután megnyomtuk az entert
  const type = "running";
  console.log(mapEvent); //there are the lat, lng propertys
  //take lat, lng propertys from mapEvent
  const { lat, lng } = mapEvent.latlng;
  //create a marker at lat, lng coords => methods are at Leaflet Docs
  L.marker([lat, lng]) //create a marker
    .addTo(map) //add marker to the map
    // .bindPopup("A pretty CSS3 popup.<br> Easily customizable.") //vind the popup
    //create a new popup object => Leaflet docs/Popup
    .bindPopup(
      L.popup({
        //propertys are in the Leaflet docs
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        //classname from CSS comes here
        className: `${type}-popup`,
      })
    )
    //Leaflet/Popup methods inherited from Layer => set popup content
    // .setPopupContent(<String|HTMLElement|Popup> content)
    .setPopupContent("Workout")
    .openPopup();
});
