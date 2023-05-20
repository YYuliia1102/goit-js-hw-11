import './css/styles.css';
import ImagesService from './ImagesService';
import LoadMoreBtn from './LoadMoreBtn';

import Notiflix from 'notiflix'

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

    try {
        const markup = await getArticlesMarkup();
        if (!markup) throw new Error("No data");
        updateNewsList(markup);
    } catch (err) {
        onError(err);
    }

    loadMoreBtn.enable();
}

async function getArticlesMarkup() {
    try {

        const articles = await imgsService.getImages();

        if (!articles) {
            loadMoreBtn.hide();
            return "";
        }
        if (articles.length === 0) throw new Error("No data");

        return articles.reduce(
            (markup, article) => markup + createMarkup(article),
            ""
        );
    } catch (err) {
        onError(err);
    }
}
function createMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    // console.log(largeImageURL);
    return `
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
}

function clearNewsList() {
    refs.gallery.innerHTML = "";
}

function onError(err) {
    console.error(err);
    loadMoreBtn.hide();
    refs.gallery.innerHTML = Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
}
