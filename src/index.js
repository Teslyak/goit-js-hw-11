import {getQuery} from "./api-pixabay";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
let page = 1;
const per_page = 40;
let SimpleLightboxGallery = {};
const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more')
}
refs.form.addEventListener('submit', onSubmit);

refs.loadMore.addEventListener('click', onLoadMore);


function onChangeInput(event) {
  refs.loadMore.classList.add('hidden');
  page = 1;
};

async function onSubmit(event) {
  event.preventDefault();
  if (!refs.input.value) {
    Notiflix.Notify.warning('Please enter data to search');
    return;
  };

  try {
    refs.gallery.innerHTML = "";
    const response = await getQuery(refs.input.value, page, per_page);
    Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);  
    if (!response.data.total) {
      refs.loadMore.classList.add('hidden');
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
      return;
    };
    await makeCard(response.data.hits);

    SimpleLightboxGallery = new SimpleLightbox('.gallery a');
  
  refs.loadMore.classList.remove('hidden');
  } catch (error) {

   Notiflix.Notify.failure('Sorry, error get data. Please try again.');
  };
};

async function onLoadMore(event) {
  refs.input.addEventListener('change', onChangeInput);
  page += 1;
  try {
    const response = await getQuery(refs.input.value, page, per_page);
    const max_page = (response.data.totalHits / per_page)^0 ;
    if (page >= max_page) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMore.classList.add('hidden');
      return;
    }
    await makeCard(response.data.hits);
    SimpleLightboxGallery.refresh();
    await scrollSmooth();
    
} catch (error) {
  Notiflix.Notify.failure('Sorry, error get data. Please try again.');
}
}

 
function makeCard(arr) {
    return arr.forEach(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => { 
      const markUp = `<div class="photo-card">
    <a class="card-link "href="${largeImageURL}" alt="${tags}" >
  <img src="${webformatURL}" alt="${tags}" loading="lazy"  width = 300 height = 200/>
  
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments} </b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
  </a>
</div>` 
        refs.gallery.insertAdjacentHTML('beforeend', markUp);
    })

}
 
function scrollSmooth() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
};