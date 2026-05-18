let currentDogImage = '';
let currentBreed = 'random';
let breedChart = null;
let savedDogsSwiper = null;

const dogImage = document.querySelector('#dog-image');
const breedSelect = document.querySelector('#breed-select');
const randomButton = document.querySelector('#random-button');
const breedButton = document.querySelector('#breed-button');
const saveButton = document.querySelector('#save-button');
const refreshButton = document.querySelector('#refresh-button');
const noteInput = document.querySelector('#note-input');
const messageArea = document.querySelector('#message-area');
const savedDogsWrapper = document.querySelector('#saved-dogs-wrapper');
const chartCanvas = document.querySelector('#breed-chart');

function showMessage(message) {
  messageArea.textContent = message;
}

function cleanBreedName(breed) {
  if (!breed) {
    return 'random';
  }

  return breed.replaceAll('/', ' ');
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadRandomDog() {
  try {
    showMessage('Loading a random dog...');

    const response = await fetch('/api/dog/random');
    const data = await response.json();

    currentDogImage = data.message;
    currentBreed = 'random';
    dogImage.src = currentDogImage;
    showMessage('Random dog loaded.');
  } catch (error) {
    showMessage('Could not load a random dog.');
  }
}

async function loadBreeds() {
  try {
    const response = await fetch('/api/dog/breeds');
    const data = await response.json();

    breedSelect.innerHTML = '<option value="">Select a breed</option>';

    data.message.forEach((breed) => {
      const option = document.createElement('option');
      option.value = breed;
      option.textContent = cleanBreedName(breed);
      breedSelect.appendChild(option);
    });
  } catch (error) {
    breedSelect.innerHTML = '<option value="">Could not load breeds</option>';
  }
}

async function loadDogByBreed() {
  const selectedBreed = breedSelect.value;

  if (!selectedBreed) {
    showMessage('Please choose a breed first.');
    return;
  }

  try {
    showMessage('Loading breed image...');

    const response = await fetch(`/api/dog/breed-image?breed=${encodeURIComponent(selectedBreed)}`);
    const data = await response.json();

    if (data.status !== 'success') {
      showMessage('That breed did not return an image.');
      return;
    }

    currentDogImage = data.message;
    currentBreed = cleanBreedName(selectedBreed);
    dogImage.src = currentDogImage;
    showMessage(`${currentBreed} image loaded.`);
  } catch (error) {
    showMessage('Could not load that breed image.');
  }
}

async function saveFavoriteDog() {
  if (!currentDogImage) {
    showMessage('Load a dog before saving.');
    return;
  }

  const favoriteDog = {
    breed: currentBreed,
    image_url: currentDogImage,
    note: noteInput.value.trim()
  };

  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(favoriteDog)
    });

    if (!response.ok) {
      const errorData = await response.json();
      showMessage(errorData.error || 'The dog could not be saved.');
      return;
    }

    noteInput.value = '';
    showMessage('Dog saved to favorites.');
    loadFavorites();
  } catch (error) {
    showMessage('Could not save this dog.');
  }
}

async function loadFavorites() {
  try {
    const response = await fetch('/api/favorites');
    const favorites = await response.json();

    renderSavedDogs(favorites);
    renderBreedChart(favorites);
  } catch (error) {
    savedDogsWrapper.innerHTML = '<div class="empty-state">Saved dogs could not be loaded.</div>';
  }
}

function renderSavedDogs(favorites) {
  savedDogsWrapper.innerHTML = '';

  if (!Array.isArray(favorites) || favorites.length === 0) {
    savedDogsWrapper.innerHTML = '<div class="empty-state">No saved dogs yet. Save one above to test Supabase.</div>';
    return;
  }

  favorites.forEach((dog) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide saved-dog-slide';

    const safeBreed = escapeHtml(dog.breed);
    const safeNote = escapeHtml(dog.note || 'No note added.');

    slide.innerHTML = `
      <img src="${dog.image_url}" alt="Saved ${safeBreed} dog">
      <div class="saved-dog-info">
        <h3>${safeBreed}</h3>
        <p>${safeNote}</p>
      </div>
    `;

    savedDogsWrapper.appendChild(slide);
  });

  if (savedDogsSwiper) {
    savedDogsSwiper.destroy(true, true);
  }

  savedDogsSwiper = new Swiper('.saved-dogs-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      700: {
        slidesPerView: 2
      },
      1000: {
        slidesPerView: 3
      }
    }
  });
}

function renderBreedChart(favorites) {
  const breedCounts = {};

  if (Array.isArray(favorites)) {
    favorites.forEach((dog) => {
      breedCounts[dog.breed] = (breedCounts[dog.breed] || 0) + 1;
    });
  }

  const labels = Object.keys(breedCounts);
  const values = Object.values(breedCounts);

  if (breedChart) {
    breedChart.destroy();
  }

  breedChart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: labels.length ? labels : ['No saved dogs'],
      datasets: [
        {
          label: 'Saved dogs by breed',
          data: values.length ? values : [0]
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

randomButton.addEventListener('click', loadRandomDog);
breedButton.addEventListener('click', loadDogByBreed);
saveButton.addEventListener('click', saveFavoriteDog);
refreshButton.addEventListener('click', loadFavorites);

loadBreeds();
loadRandomDog();
loadFavorites();
