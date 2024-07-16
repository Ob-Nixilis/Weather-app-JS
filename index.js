const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");
const searchInput = document.querySelector(".search-box input");

const getWeather = () => {
  const APIKey = "f9172e46304a8be0254100d0be4a8e14";
  const city = searchInput.value;

  if (city === "") return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
  .then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        return response.json().then(json => {
          throw new Error('404');
        });
      } else {
        throw new Error('Network response was not ok');
      }
    }
    return response.json();
  })
  .then(json => {
    if (json.cod === '404') {
      container.style.height = '400px';
      weatherBox.style.display = 'none';
      weatherDetails.style.display = 'none';
      error404.style.display = 'block';
      error404.classList.add('fadeIn');

      // Mettre à jour l'image 404 et le texte
      const errorImage = error404.querySelector("img");
      const errorText = error404.querySelector("p");
      errorImage.src = 'images/404.png';
      errorText.innerHTML = 'Oops! Invalid location :/';
      
      return;
    }

    error404.style.display = 'none';
    error404.classList.remove('fadeIn');

    const image = document.querySelector(".weather-box img");
    const temperature = document.querySelector(".weather-box .temperature");
    const description = document.querySelector(".weather-box .description");
    const humidity = document.querySelector(".weather-details .humidity span");
    const wind = document.querySelector(".weather-details .wind span");

    console.log('Weather condition:', json.weather[0].main); // Ajoutez cette ligne pour vérifier la valeur

    switch (json.weather[0].main) {
      case 'Clear':
        image.src = 'images/clear.png';
        break;
      case 'Rain':
        image.src = 'images/rain.png';
        break;
      case 'Snow':
        image.src = 'images/snow.png';
        break;
      case 'Clouds':
        image.src = 'images/cloud.png';
        break;
      case 'Haze':
      case 'Mist':
      case 'Fog':
      case 'Smoke':
      case 'Dust':
      case 'Sand':
      case 'Ash':
      case 'Squall':
      case 'Tornado':
        image.src = 'images/mist.png';
        break;
      default:
        image.src = ''; // Mettre une image par défaut si aucune condition ne correspond
    }

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}km/h`;

    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '590px';
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    container.style.height = '400px';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'block';
    error404.classList.add('fadeIn');

    // Mettre à jour l'image 404 et le texte
    const errorImage = error404.querySelector("img");
    const errorText = error404.querySelector("p");

    if (error.message === '404') {
      errorImage.src = 'images/404.png';
      errorText.innerHTML = 'Oops! Invalid location :/';
    }
  });
};

search.addEventListener("click", getWeather);

// Ajout de l'événement pour la touche "Entrée"
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
});

