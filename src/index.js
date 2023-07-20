import {getQuery} from "./api-pixabay";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
let page = 1;

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more')
}
refs.form.addEventListener('submit', onSubmit);

refs.loadMore.addEventListener('click', onLoadMore);
refs.input.addEventListener('change', onChangeInput);

function onChangeInput(event) {
  refs.loadMore.classList.add('hidden');
  page = 1;
}

async function onSubmit(event) {
  event.preventDefault();
  try {
    refs.gallery.innerHTML = "";
  const response = await getQuery(refs.input.value, page)
  
    if (!response.data.total) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
    };
  await makeCard(response.data.hits)

  const gallery = new SimpleLightbox('.gallery a');
  refs.loadMore.classList.remove('hidden');
  } catch (error) {
    console.log(error);
   Notiflix.Notify.failure('Sorry, error get data. Please try again.');
}
}

async function onLoadMore(event) {
  event.preventDefault();
  page += 1;
  try {
    const response = await getQuery(refs.input.value, page);
    if (page >= response.data.totalHits) {
      Notiflix.Notify.info('End of collection');
      refs.loadMore.classList.add('hidden');
      return
    }
  await makeCard(response.data.hits)
  const gallery = new SimpleLightbox('.gallery a');
  gallery.refresh();
} catch (error) {
  console.log(error);
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
 
