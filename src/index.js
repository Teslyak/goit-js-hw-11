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
  guard: document.querySelector('.js-guard')
};

refs.form.addEventListener('submit', onSubmit);


const options = {
    root: null,
    rootMargin: '500px',
    threshold: 1.0
}
const observer = new IntersectionObserver(onLoadMore, options);


function onChangeInput(event) {
  page = 1;
};

async function onSubmit(event) {
  event.preventDefault();
  
  if (!refs.input.value.trim()) {
    Notiflix.Notify.warning('Please enter data to search');
    return;
  };

  if (refs.input.value.trim() === refs.input.value.trim()) {
    page = 1;
  }

  try {
    refs.gallery.innerHTML = "";
    const response = await getQuery(refs.input.value.trim(), page, per_page);
    Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);  
    if (!response.data.total) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
      return;
    };
    await makeCard(response.data.hits);
    SimpleLightboxGallery = new SimpleLightbox('.gallery a');
  observer.observe(refs.guard);
  } catch (error) {
   Notiflix.Notify.failure('Sorry, error get data. Please try again.');
  };
};

function onLoadMore(entries, observer) {
  refs.input.addEventListener('change', onChangeInput);
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      page += 1;
      queryLoadMore();
    }
  });

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
  top: cardHeight * 2 ,
  behavior: "smooth",
});
};

async function queryLoadMore() {
    try {
      const response = await getQuery(refs.input.value.trim(), page, per_page);
      const max_page = Math.ceil(response.data.totalHits / per_page);
      if (page > max_page) {
        observer.unobserve(refs.guard);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      return;
      } else if (page >= max_page) {
        observer.unobserve(refs.guard);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
     await makeCard(response.data.hits);
    SimpleLightboxGallery.refresh();
    await scrollSmooth();
    
  } catch (error) {
  Notiflix.Notify.failure('Sorry, error get data. Please try again.');
}
}


