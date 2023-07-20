import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";

const API_KEY = "38347211-89c6526cb0e004a458383526f";
const QUERY_OPT = "image_photo&orientation=horizontal&safesearch=true";
const PER_PAGE = 40;

async function getQuery(value, page) {
const response = await axios.get(
`${BASE_URL}?key=${API_KEY}&q=${value}&${QUERY_OPT}&page=${page}&per_page=${PER_PAGE}`);
return response;
};

export {getQuery}
