const userForm = document.querySelector('form');
const userInputField = document.querySelector('input[type="text"]');
const ipDisplay = document.getElementById('ip-address');
const locationDisplay = document.getElementById('location');
const timeZoneDisplay = document.getElementById('timeZone');
const findIpBtn = document.getElementById('noText');
const ispDisplay = document.getElementById('isp');
//regex i found off docs for ip validation
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const updateUi = (ip, location, timeZone, isp) => {
    ipDisplay.textContent = ip;
    locationDisplay.textContent = location;
    timeZoneDisplay.textContent = `UTC ${timeZone}`;
    ispDisplay.textContent = isp;
};
const searchIpAdress = async (input) => {
    try {
    const req = await fetch(`/.netlify/functions/fetchData?ipAddress=${input}`);
    const response = await req.json();
  if (response.location && response.location.lat && response.location.lng) {
    const { location, ip, isp } = response;
    updateUi(ip, location.city, location.timezone, isp);
   
    if (map !== undefined && map !== null) {
    map.remove();
  }
  
  create_map(location.lat, location.lng, location.country, location.region);
  } 
  else {
      throw new Error('Location Data is Incomplete');
      alert('Location Data Incomplete, Please refresh and try again');
  }
  }
  catch(error) {
      console.log(error);
      alert(` there was an error: ${error}`);
  }
};
let map;
function create_map(lat, lng, country, region) {
  map = L.map('map').setView([lat, lng], 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`${region}, ${country}`)
    .openPopup();
}
const defaultIp = '197.210.78.172';
searchIpAdress(defaultIp);
userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInput = userInputField.value.trim();
    if (ipRegex.test(userInput)) {
        searchIpAdress(userInput);
        userInputField.style.borderColor = '';
    }
    else {
        alert(`Incorrect Format or Address: ${userInput}`);
        userInputField.style.borderColor = 'red';
    }
    
});
findIpBtn.addEventListener('click', () => {
 const userInput = userInputField.value.trim();
    searchIpAdress(userInput);
});
