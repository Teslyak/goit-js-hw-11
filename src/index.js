import { getQuery } from "./api-pixabay";
import Notiflix from 'notiflix';

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
  
    console.log(response);
    if (!response.data.total) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
    };
    await makeCard(response.data.hits)
} catch (error) {
   Notiflix.Notify.failure('Sorry, error get data. Please try again.');
}
}
 
function makeCard(arr) {
    return arr.forEach(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => { 
   const markUp = `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:${likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${comments} </b>
    </p>
    <p class="info-item">
      <b>Downloads:${downloads}</b>
    </p>
  </div>
</div>` 
        refs.gallery.insertAdjacentHTML('beforeend', markUp);
    })

}
 
