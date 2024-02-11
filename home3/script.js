import config from './config.js';

const accessKey = config.accessKey;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

const imageEl = document.getElementById('image');
const photographerEl = document.getElementById('photographer');
const likeButtonEl = document.getElementById('likeButton');
const likesCountEl = document.getElementById('likesCount');
const prevButtonEl = document.querySelector('.prevButton');
const nextButtonEl = document.querySelector('.nextButton');

let likedImages = {};
let imageHistory = [];
let currentImageIndex = -1;

async function getRandomImage() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch random image');
    }

    const data = await response.json();
    const { urls, user } = data;

    imageEl.src = urls.small;
    photographerEl.textContent = `Photo by ${user.name}`;

    const imageId = data.id;

    const likesCount = likedImages[imageId] || 0;
    updateLikesCount(likesCount);

    addToImageHistory(data);
  } catch (error) {
    console.error('Error random image', error);
  }
}

function updateLikesCount(count) {
  likesCountEl.textContent = count;
}

function addToImageHistory(imageData) {
  imageHistory.unshift(imageData);
  currentImageIndex = 0;
  renderCurrentImage();
}

function saveImageHistory() {
  localStorage.setItem('imageHistory', JSON.stringify(imageHistory));
  localStorage.setItem('currentImageIndex', currentImageIndex);
  localStorage.setItem('likedImages', JSON.stringify(likedImages)); // Сохраняем лайки
}

function loadImageHistory() {
  const storedImageHistory = localStorage.getItem('imageHistory');
  const storedCurrentImageIndex = localStorage.getItem('currentImageIndex');
  const storedLikedImages = localStorage.getItem('likedImages'); // Загружаем лайки

  if (storedImageHistory && storedCurrentImageIndex && storedLikedImages) {
    imageHistory = JSON.parse(storedImageHistory);
    currentImageIndex = parseInt(storedCurrentImageIndex);
    likedImages = JSON.parse(storedLikedImages); // Загружаем лайки
    renderCurrentImage();
  }
}

prevButtonEl.addEventListener('click', () => {
  if (currentImageIndex < imageHistory.length - 1) {
    currentImageIndex++;
    renderCurrentImage();
  }
});

nextButtonEl.addEventListener('click', () => {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    renderCurrentImage();
  }
});

function renderCurrentImage() {
  const imageData = imageHistory[currentImageIndex];
  if (imageData) {
    imageEl.src = imageData.urls.small;
    photographerEl.textContent = `Photo by ${imageData.user.name}`;
    const imageId = imageData.id;
    const likesCount = likedImages[imageId] || 0;
    updateLikesCount(likesCount);

    likeButtonEl.textContent = likedImages[imageId] ? 'Liked' : 'Like';
  }
}

window.addEventListener('load', () => {
  loadImageHistory();
  getRandomImage();

  likeButtonEl.addEventListener('click', () => {
    const imageData = imageHistory[currentImageIndex];
    const imageId = imageData.id;

    if (!likedImages[imageId]) {
      likedImages[imageId] = 1;
      updateLikesCount(likedImages[imageId]);
      likeButtonEl.textContent = 'Liked';
    } else {
      likedImages[imageId] = 0;
      updateLikesCount(likedImages[imageId]);
      likeButtonEl.textContent = 'Like';
    }

    saveImageHistory();
  });
});

loadImageHistory();
