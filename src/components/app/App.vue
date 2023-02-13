<template>
  <div class="app font-monospace">
    <div class="content">
      <AppInfo :allMoviesCount="movies.length" :favouriteMoviesCount="movies.filter(c => c.favourite).length" />
      <div class="search-panel">
        <SearchPanel :updateTermHandler="updateTermHandler" />
        <AppFilter :updateFilterHandler="updateFilterHandler" :filterName="filter" />
      </div>
      <Box v-if="!movies.length && !isLoading">
        <p class="text-danger text-center fs-3">Kinolar yo'q</p>
      </Box>
      <Box v-else-if="isLoading">
        <Loader />
      </Box>
      <MovieList v-else :movies="onFilterHandler(onSearchHandler(movies, term), filter)" @onToggle="onToggleHandler"
        @onRemove="onRemoveHandler" />
      <Box>
        <nav aria-label="pagination">
          <ul class="pagination justify-content-center">
            <li v-for="pageNumber in totalPages" :key="pageNumber" :class="{ 'active': pageNumber == page }"
              @click="changePageHandler(pageNumber)">
              <span class="page-link">{{ pageNumber }}</span>
            </li>
          </ul>
        </nav>
      </Box>
      <MovieAddForm @createMovie="createMovie" />
    </div>
  </div>
</template>

<script>
import AppInfo from "@/components/app-info/AppInfo.vue"
import SearchPanel from "@/components/search-panel/SearchPanel.vue"
import AppFilter from "@/components/app-filter/AppFilter.vue"
import MovieList from "../movie-list/MovieList.vue"
import MovieAddForm from "../movie-add-form/MovieAddForm.vue"
import axios from "axios"

export default {
  components: {
    AppInfo,
    SearchPanel,
    AppFilter,
    MovieList,
    MovieAddForm,
  },
  data() {
    return {
      movies: [],
      term: '',  //qidiruv panelidagi qiymatlar shu o'zgaruvchida qilinadi
      filter: 'all',
      isLoading: false,
      limit: 10,
      page: 1,
      totalPages: 0,
    }
  },
  methods: {
    createMovie(item) {
      this.movies.push(item)
    },
    onToggleHandler({ id, prop }) {
      this.movies = this.movies.map(item => {
        if (item.id = id) {
          return { ...item, [prop]: !item[prop] }
        }
        return item
      })
    },
    onRemoveHandler(id) {
      this.movies = this.movies.filter(c => c.id != id)
    },
    onSearchHandler(arr, term) { //qidiruv tizmiga ishlatiluvchi funksiya
      if (term.length == 0) {
        return arr
      }
      return arr.filter(c => c.name.toLowerCase().indexOf(term) > -1)
    },
    onFilterHandler(arr, filter) {
      switch (filter) {
        case 'popular':
          return arr.filter(c => c.like)
        case 'mostViewers':
          return arr.filter(c => c.viewers > 500)
        default:
          return arr
      }
    },
    updateTermHandler(term) {
      this.term = term
    },
    updateFilterHandler(filter) {
      this.filter = filter
    },
    async fetchMovie() { //serverga yuborilgan sorov vaqtida null qaytmasligi uchun ushlab turiladigan malum vaqt uchun async await funksiyasi ishlatiladi
      try {
        this.isLoading = true
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
          params: {
            _limit: this.limit,
            _page: this.page,
          }
        }) //serverga yuborilgan sorovni doim try catch blogi ichiga olishimiz kerak
        const newArr = response.data.map(item => ({
          id: item.id,
          name: item.title,
          like: false,
          favourite: false,
          viewers: item.id * 10,
        }))
        this.totalPages = Math.ceil(response.headers['x-total-count'] / this.limit) //umumiy sahifalarni alohida sahifalarga bolish uchun funksiya
        this.movies = newArr
      }
      catch (error) {
        alert(error.message)
      }
      finally {
        this.isLoading = false
      }
    },
    changePageHandler(page) {
      this.page = page
    },
  },
  mounted() {
    this.fetchMovie()
  },
  watch: { // qandaydir xatolik bolganda quyidagi kod ishga tushadi
    page() {
      this.fetchMovie()
    }
  }
}
</script>

<style>
.app {
  height: 100vh;
  color: #000;
}

.content {
  width: 1000px;
  min-height: 700px;
  background-color: #fff;
  margin: 0 auto;
  padding: 5rem 10px;
}

.search-panel {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #fcfaf5;
  border-radius: 4px;
  box-shadow: 15px 15px 15px rgb(0, 0, 0, 0.15);
}
</style>