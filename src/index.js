import './css/styles.css';
import ImagesService from './ImagesService';
import LoadMoreBtn from './LoadMoreBtn';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector("#search-box"),
    gallery: document.querySelector(".gallery"),
};

const imgsService = new ImagesService();
const loadMoreBtn = new LoadMoreBtn({
    selector: ".load-more",
    isHidden: true,
});

refs.form.addEventListener("submit", onSubmit);
loadMoreBtn.button.addEventListener("click", fetchArticles);

function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    document.getElementsByClassName('button-load-wrap')[0].style.display = 'none';
    // console.log(document.querySelector("[name=searchQuery]").value);
    const value = document.querySelector("[name=searchQuery]").value.trim();


    if (value === "") {
        Notiflix.Notify.warning('Please enter your request')
    }
    else {
        imgsService.searchQuery = value;
        imgsService.resetPage();

        loadMoreBtn.show();
        clearNewsList();
        fetchArticles().finally(() => form.reset());
    }
}

async function fetchArticles() {
    loadMoreBtn.disable();

    const markup = await getArticlesMarkup();
    if (markup) {
        updateNewsList(markup);
    }

    loadMoreBtn.enable();
}

async function getArticlesMarkup() {

    const articles = await imgsService.getImages();

    if (!articles || articles.length === 0) {
        loadMoreBtn.hide();
        const msg = 'Sorry, there are no images matching your search query. Please try again.';
        refs.gallery.innerHTML = msg;
        Notiflix.Notify.warning(msg);
        return false;
    }

    return articles.reduce(
        (markup, article) => markup + createMarkup(article),
        ""
    );
}
function createMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    // console.log(largeImageURL);
    return `
        <div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}"><img class="gallery__image" data-source="${largeImageURL}" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
}


function updateNewsList(markup) {

    refs.gallery.insertAdjacentHTML("beforeend", markup);
    document.getElementsByClassName('button-load-wrap')[0].style.display = 'flex';
    let lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        captionsData: 'alt',
    });
    lightbox.on('show.simpleLightbox')
}

function clearNewsList() {
    refs.gallery.innerHTML = "";
}