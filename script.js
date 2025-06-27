const API_URL = 'https://api.thedogapi.com/v1';

const breedInput = document.getElementById('breedInput');
const searchButton = document.getElementById('searchButton');
const randomButton = document.getElementById('randomButton');
const breedName = document.getElementById('breedName');
const breedImage = document.getElementById('breedImage');
const breedTemperament = document.getElementById('breedTemperament');
const breedLifespan = document.getElementById('breedLifespan');
const breedOrigin = document.getElementById('breedOrigin');
const resultsSection = document.querySelector('.results-section');
const themeToggleButton = document.getElementById('themeToggleButton');



searchButton.addEventListener('click', searchBreed);


randomButton.addEventListener('click', fetchRandomDog);


themeToggleButton.addEventListener('click', toggleDarkMode);


async function searchBreed() {
    const query = breedInput.value.trim();
    if (!query) {

        alert('Please enter a dog breed name!');
        return;
    }

    try {

        const breedResponse = await fetch(`${API_URL}/breeds/search?q=${query}`);
        const breeds = await breedResponse.json();

        if (breeds.length === 0) {
            alert('Breed not found. Please try a different name.');
            resultsSection.style.display = 'none';
            return;
        }


        const breed = breeds[0];


        const imageResponse = await fetch(`${API_URL}/images/search?breed_id=${breed.id}`);
        const images = await imageResponse.json();

        const imageUrl = images.length > 0 ? images[0].url : 'https://via.placeholder.com/400x300?text=No+Image';


        breedName.textContent = breed.name;
        breedImage.src = imageUrl;
        breedImage.alt = breed.name;
        breedTemperament.textContent = `Temperament: ${breed.temperament || 'N/A'}`;
        breedLifespan.textContent = `Lifespan: ${breed.life_span || 'N/A'}`;
        breedOrigin.textContent = `Origin: ${breed.origin || 'N/A'}`;


        resultsSection.style.display = 'block';

    } catch (error) {

        console.error('Error fetching dog data:', error);
        alert('Failed to fetch dog data. Please check your network connection and try again.');
        resultsSection.style.display = 'none';
    }
}


async function fetchRandomDog() {
    try {

        const response = await fetch(`${API_URL}/images/search?limit=1&has_breeds=1`);
        const data = await response.json();


        if (data.length === 0 || !data[0].breeds || data[0].breeds.length === 0) {
            alert('Could not fetch a random dog with breed info. Please try again.');
            resultsSection.style.display = 'none';
            return;
        }


        const randomDogImage = data[0];
        const breed = randomDogImage.breeds[0];


        breedName.textContent = breed.name;
        breedImage.src = randomDogImage.url;
        breedImage.alt = breed.name;
        breedTemperament.textContent = `Temperament: ${breed.temperament || 'N/A'}`;
        breedLifespan.textContent = `Lifespan: ${breed.life_span || 'N/A'}`;
        breedOrigin.textContent = `Origin: ${breed.origin || 'N/A'}`;


        resultsSection.style.display = 'block';

    } catch (error) {
        console.error('Error fetching random dog:', error);
        alert('Failed to fetch a random dog. Please try again later.');
        resultsSection.style.display = 'none';
    }
}


function toggleDarkMode() {

    document.body.classList.toggle('dark-mode');


    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleButton.textContent = 'Toggle Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleButton.textContent = 'Toggle Dark Mode';
    }
}


function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Toggle Light Mode';
    } else {

        document.body.classList.remove('dark-mode');
        themeToggleButton.textContent = 'Toggle Dark Mode';
    }
}


loadThemePreference();
