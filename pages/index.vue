<style>
  #repoResultList{
    border: 1px solid black;
  } 
  .result-count {
    height: 10px;
    border-bottom: 2px solid black;
  }
  .repoList {
  }
  .repoResult {
    border-bottom: 1px solid #1a1a1a;
  }
  .dark-grey {
    background-color: #333333;
  }
  .spinner {
    margin: 30px 0 0 50px;
  }
  < !-- Guess vue-dark does not include scroll bar theming... -->
  #virtual-scroll { 
  scrollbar-face-color: #646464;
  scrollbar-base-color: #646464;
  scrollbar-3dlight-color: #646464;
  scrollbar-highlight-color: #646464;
  scrollbar-track-color: #000;
  scrollbar-arrow-color: #000;
  scrollbar-shadow-color: #646464;
  scrollbar-dark-shadow-color: #646464;
  }
  ::-webkit-scrollbar { width: 8px; height: 3px;}
  ::-webkit-scrollbar-button {  background-color: #666; }
  ::-webkit-scrollbar-track {  background-color: #646464;}
  ::-webkit-scrollbar-track-piece { background-color: #000;}
  ::-webkit-scrollbar-thumb { height: 50px; background-color: #666; border-radius: 3px;}
  ::-webkit-scrollbar-corner { background-color: #646464;}
  ::-webkit-resizer { background-color: #666;}
  input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #303030 inset;
  }
</style>

<template>
  <div id="#app">
    <v-container >
      
      <v-layout>
        <v-flex xs6 offset-xs3 justify-center align-center>
            <v-text-field 
              :placeholder="currentSearchTerm"
              id="repoSearchInput"
              name="repoSearchInput"
              label="Search Repositories"
              v-model="repoSearchInputStr"
            ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex v-if="resultsCountForTerm(false) === 0" xs6 offset-xs5 justify-center align-center>
          <p> No repositories were found. </p>
        </v-flex>

        <!-- Hide results box if state.repoList is empty -->
        <v-flex v-if="repoList.length > 0" xs12>
            <v-list two-line dense>

              <v-subheader class="result-count"> &#8220;{{currentSearchTerm}}&#8221; - 
                <span v-if="!searchInProgress">&nbsp {{resultsCountForTerm(true)}} Results</span>
                <span v-else>&nbsp Loading Results</span>
              </v-subheader>

              <virtual-list id="virtual-scroll" :size="61" :remain="(repoList.length<10) ? repoList.length: 10" :bench="20" emit-update="true" :debounce="500" :tobottom="loadNextPage"> <!-- size="v-list-tile boxheight" -->
                <v-list-tile v-for="(repo, index) in repoList" :key="repo.id" router :to="'/repo/' + repo.id" class="repoResult" :class="{'dark-grey': index % 2 === 0}">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="repo.name"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="repo.description"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </virtual-list>

            </v-list>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex v-if="isSearching" xs2 offset-xs5>
          <clip-loader size="10px" class="spinner" :color="'#0d0d0d'"></clip-loader>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>


<script>
  import gitHubAPI from '~/plugins/gitHubAPI'
  import store from '~/store'
  import { mapGetters } from 'vuex'
  import debounce from 'debounce'
  import virtualList from 'vue-virtual-scroll-list'
  import ClipLoader from 'vue-spinner/src/PulseLoader.vue'

  const theStore = store()
  const debounceInterval = 400 // How long should we wait after user input to look up the term
  let rateExceededRecentlyNotified = false

  export default {
    data () {
      return {
        repoSearchInputStr: null
      }
    },
    components: {
      'virtual-list': virtualList,
      'clip-loader': ClipLoader
    },
    watch: {
      repoSearchInputStr (currentStr, prevStr) {
        // Modifies "Result count" text to notify user new term results are loading
        theStore.commit('updateCurrentSearchTerm', currentStr)
        // This is used to show "Loading results"
        theStore.commit('updateSearchInProgress', 1)
        if (currentStr.length === 0) {
          // Box was cleared; empty store
          theStore.commit('updateSearchInProgress', 0)
          theStore.commit('updateRequestedPage', 1)
          theStore.commit('updateResultsCountForTerm', -1)
          theStore.commit('updateRepoList', [])
          return
        }
        // v-debounce does not function with text-field, do it manually
        let repoSearch = debounce(this.repoSearch, debounceInterval)
        repoSearch(currentStr)
      }
    },
    computed: {
      ...mapGetters([
        'repoList',
        'currentSearchTerm',
        'searchInProgress'
      ]),
      resultsCountForTerm () {
        // Regex parses in commas, toLocaleString not supported in Safari. Return plain int if false arg for v-if "none found"
        return pretty => (pretty) ? theStore.getters.resultsCountForTerm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : theStore.getters.resultsCountForTerm
      },
      isSearching () {
        // To not use loader on new term str / on scroll: theStore.getters.resultsCountForTerm === -1 &&
        if (theStore.getters.searchInProgress) return true
      }
    },
    methods: {
      repoSearch (term, isNextPage) {
        if (!isNextPage) theStore.commit('updateRequestedPage', 1) // this is a new set of results
        let params = {
          q: term,
          per_page: 30,
          page: theStore.getters.requestedPage
          /* ^ todo: we can divide the window height to determine the best per_page */
        }
        gitHubAPI.repoSearchByTerm(params, this.updateSearchResults, this.notifyRateLimitExceeded)
      },
      updateSearchResults (data) {
        // Drop the UI update if newer input sequence has happened, wait for that update
        // Wastes ajax resources when input mutates quickly, but keeps search responsive ({param} data = api response)
        if (data.config.params.q !== theStore.state.currentSearchTerm) return

        // Push API response to store.repoList
        theStore.commit('updateSearchInProgress', 0)
        theStore.commit('updateResultsCountForTerm', data.data.total_count)

        // Handle a scroll update (request more results for previous term and append)
        if (theStore.getters.requestedPage > 1) {
          let currentResults = theStore.getters.repoList
          theStore.commit('updateRepoList', currentResults.concat(data.data.items))
          return
        }

        theStore.commit('updateRepoList', data.data.items)
      },
      loadNextPage () {
        let term = theStore.getters.currentSearchTerm
        theStore.commit('updateSearchInProgress', 1)
        theStore.commit('updateRequestedPage', theStore.getters.requestedPage + 1)
        this.repoSearch(term, true)
      },
      notifyRateLimitExceeded () {
        // Ajax load could delay rate limited realization & spam user. Track if recently notified
        theStore.commit('updateSearchInProgress', 0)
        if (rateExceededRecentlyNotified) return
        rateExceededRecentlyNotified = true
        alert('GitHub API Rate Limit Exceeded')
        setTimeout(function () {
          rateExceededRecentlyNotified = false
        }, 4000)
      }
    }
  }
</script>