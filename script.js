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
const loadingSpinner = document.getElementById('loadingSpinner');



searchButton.addEventListener('click', searchBreed);


randomButton.addEventListener('click', fetchRandomDog);

themeToggleButton.addEventListener('click', toggleDarkMode);


async function searchBreed() {
    const query = breedInput.value.trim();
    if (!query) {

        alert('Please enter a dog breed name!');
        return;
    }


    resultsSection.style.display = 'none';
    loadingSpinner.style.display = 'block';

    try {

        const breedResponse = await fetch(`${API_URL}/breeds/search?q=${query}`);
        const breeds = await breedResponse.json();


        if (breeds.length === 0) {
            alert('Breed not found. Please try a different name.');
            return;
        }

        const breed = breeds[0];


        const imageResponse = await fetch(`${API_URL}/images/search?breed_id=${breed.id}`);
        const images = await imageResponse.json();
        

        const imageUrl = images.length > 0 ? images[0].url : 'https://via.placeholder.com/400x300?text=No+Image';

        // Step C: Update the HTML elements with the fetched data
        breedName.textContent = breed.name;
        breedImage.src = imageUrl;
        breedImage.alt = breed.name;
        breedTemperament.textContent = `Temperament: ${breed.temperament || 'N/A'}`;
        breedLifespan.textContent = `Lifespan: ${breed.life_span || 'N/A'}`;
        breedOrigin.textContent = `Origin: ${breed.origin || 'N/A'}`;

    } catch (error) {

        console.error('Error fetching dog data:', error);
        alert('Failed to fetch dog data. Please check your network connection and try again.');
    } finally {

        loadingSpinner.style.display = 'none';

        if (breedName.textContent) {
            resultsSection.style.display = 'block';
        }
    }
}


async function fetchRandomDog() {

    resultsSection.style.display = 'none';
    loadingSpinner.style.display = 'block';

    try {

        const breedsResponse = await fetch(`${API_URL}/breeds`);
        const breeds = await breedsResponse.json();

        if (breeds.length === 0) {
            alert('Could not fetch the list of breeds. The API might be unavailable.');
            return;
        }


        const randomIndex = Math.floor(Math.random() * breeds.length);
        const randomBreed = breeds[randomIndex];


        const imageResponse = await fetch(`${API_URL}/images/search?breed_id=${randomBreed.id}`);
        const images = await imageResponse.json();

        const imageUrl = images.length > 0 ? images[0].url : 'https://via.placeholder.com/400x300?text=No+Image';


        breedName.textContent = randomBreed.name;
        breedImage.src = imageUrl;
        breedImage.alt = randomBreed.name;
        breedTemperament.textContent = `Temperament: ${randomBreed.temperament || 'N/A'}`;
        breedLifespan.textContent = `Lifespan: ${randomBreed.life_span || 'N/A'}`;
        breedOrigin.textContent = `Origin: ${randomBreed.origin || 'N/A'}`;

    } catch (error) {
        console.error('Error fetching random dog:', error);
        alert('Failed to fetch a random dog. Please check your network and try again.');
    } finally {

        loadingSpinner.style.display = 'none';
        if (breedName.textContent) {
            resultsSection.style.display = 'block';
        }
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