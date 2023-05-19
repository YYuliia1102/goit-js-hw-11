import axios from "axios";
const URL = "https://pixabay.com/api/";

// "https://pixabay.com/api/?key={ KEY }&q=yellow+flowers&image_type=photo";

const API_KEY = '35924143-9020fc77f3274be39114409f4';

export default class ImagesService {
    constructor() {
        this.page = 1;
        this.searchQuery = "";
    }

    async getImages() {
        //* axios await
        
        const { data } = await axios.get(
            `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
        );
        
        this.incrementPage();
        return data.hits;
    }

        resetPage() {
            this.page = 1;
        }

        incrementPage() {
            this.page += 1;
        }
    }
