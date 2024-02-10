import config from './config.js';

const accessKey = config.accessKey;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

const imageEl = document.getElementById('image');
const photographerEl = document.getElementById('photographer');
const likeButtonEl = document.getElementById('likeButton');
const likesCountEl = document.getElementById('likesCount');

let likesCount = 0;
let likedImages = [];

// Получение случайного изображения из Unsplash
async function getRandomImage() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const { urls, user } = data;
      imageEl.src = urls.small;
      photographerEl.textContent = `Photo by ${user.name}`;

      const imageId = data.id;
      likesCount = likedImages[imageId] || 0;
      updateLikesCount();
    } catch (error) {
      console.error('Error random image', error);
    }
  }
  function updateLikesCount() {
    likesCountEl.textContent = likesCount;
  }

window.addEventListener('load', () => {
  getRandomImage();
});

likeButtonEl.addEventListener('click', () => {
    const imageId = imageEl.src;
    if (!likedImages[imageId]) {
      likedImages[imageId] = 1;
      likeButtonEl.textContent = 'Liked'
    } else {
      likedImages[imageId] = 0;
      likeButtonEl.textContent = 'Like'
    }
    likesCount = likedImages[imageId];
    updateLikesCount();
    saveLikedImages();
  });

  function saveLikedImages() {
    localStorage.setItem('likedImages', JSON.stringify(likedImages));
  }

  function loadLikedImages() {
    const storedLikedImages = localStorage.getItem('likedImages');
    if (storedLikedImages) {
      likedImages = JSON.parse(storedLikedImages);
    }
  }

loadLikesCount();
