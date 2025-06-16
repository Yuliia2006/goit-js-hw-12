
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('#load-more-btn');

const PER_PAGE = 15;
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.warning({ message: 'Please enter a search query.' });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  loadMoreBtn.hidden = true;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
        createGallery(data.hits);
        toggleLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({ message: 'An error occurred. Please try again later.' });
  } finally {
    hideLoader();
  }
});

function smoothScrollByCardHeight() {
    const firstCard = document.querySelector('.gallery-item');
    if (!firstCard) return;
  
    const cardHeight = firstCard.getBoundingClientRect().height;
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    showLoader();
    loadMoreBtn.disabled = true;
  
    try {
      const data = await getImagesByQuery(currentQuery, currentPage);
      createGallery(data.hits);
  
      setTimeout(() => {
        smoothScrollByCardHeight();
      }, 300); 
  
      toggleLoadMoreBtn();
    } catch (error) {
      iziToast.error({ message: 'Failed to load more images.' });
    } finally {
      hideLoader();
      loadMoreBtn.disabled = false;
    }
  });
  
  function toggleLoadMoreBtn() {
    const loadedImages = document.querySelectorAll('.gallery-item').length;
  
    if (loadedImages >= totalHits) {
      loadMoreBtn.hidden = true;
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight"
      });
    } else {
      loadMoreBtn.hidden = false;
    }
  }
 
