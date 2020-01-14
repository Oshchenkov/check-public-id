async function initGeoInfo() {
  const geoInfoHtmlEl = document.querySelector(".geo-info");
  const geoInfoHtmlUl = document.createElement("ul");
  geoInfoHtmlUl.className = "geo-info__ul";
  geoInfoHtmlEl.innerHTML = ""; // clear old for reload
  geoInfoHtmlEl.insertAdjacentElement("beforeend", geoInfoHtmlUl);
  let geoObj = {};

  async function getInfoByUserPublicIp() {
    const ipInfoRequestURL = new URL("http://www.geoplugin.net/json.gp");

    return await fetch(ipInfoRequestURL)
      .then(response => response.json())
      .then(result => result)
      .catch(error => console.log("Fetch error: ", error));
  }

  async function showGeoInfo(geoObj) {
    for (let key in geoObj) {
      if (!(key === "geoplugin_credit" || geoObj[key].length == 0)) {
        geoInfoHtmlUl.insertAdjacentHTML(
          "beforeend",
          `<li class="geo-info__li">${key}: <b>${geoObj[key]}</b></li>`
        );
      }
    }
  }

  geoObj = await getInfoByUserPublicIp();

  showGeoInfo(geoObj);
  initMap(geoObj);
}

window.addEventListener("load", () => {
  initGeoInfo();
});

const btnLoad = document.querySelector("#loadBtn");
btnLoad.addEventListener("click", e => {
  e.preventDefault();
  initGeoInfo();
});

// Map by coordinates
let map;
function initMap(options) {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10
  });

  currentCoordinates = {
    lat: parseFloat(options.geoplugin_latitude),
    lng: parseFloat(options.geoplugin_longitude)
  };

  map.setCenter(currentCoordinates);

  let cityCircle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.7,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.3,
    map: map,
    center: currentCoordinates,
    radius: parseFloat(options.geoplugin_locationAccuracyRadius) * 100
  });
  console.log(map);
}
