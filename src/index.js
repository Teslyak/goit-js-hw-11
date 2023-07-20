import { getQuery } from "./api-pixabay";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    gallery: document.querySelector('.gallery')
}

refs.form.addEventListener('submit', onSubmit);


async function onSubmit(event) {
    event.preventDefault();
try {
  const response = await getQuery(refs.input.value)
  
    if (!response.data.total) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
    };
  await makeCard(response.data.hits)

  const gallery = new SimpleLightbox('.gallery a');
  
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
 
