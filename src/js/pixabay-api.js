import axios from "axios";

const API_KEY = '50800171-f0005a0681d5ee847775b056c';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15; 

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
    page: page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    if (response.data.hits.length === 0) {
      throw new Error('Sorry, there are no images matching your search query. Please try again!');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}