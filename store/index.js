import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  sidebar: false,
  currentSearchTerm: null,
  repoList: [],
  resultsCountForTerm: -1,
  searchInProgress: 0,
  requestedPage: 1,
  repoInformation: {},
  browseRepoList: []
}

const getters = {
  sidebar: function () { return state.sidebar },
  repoList: function () { return state.repoList },
  currentSearchTerm: function () { return state.currentSearchTerm },
  resultsCountForTerm: function () { return state.resultsCountForTerm },
  searchInProgress: function () { return state.searchInProgress },
  requestedPage: function () { return state.requestedPage },
  repoInformation: function () { return state.repoInformation },
  browseRepoList: function () { return state.browseRepoList }
}

const mutations = {
  updateRepoList: (state, payload) => {
    state.repoList = payload
  },
  updateCurrentSearchTerm: (state, payload) => {
    state.currentSearchTerm = payload
  },
  toggleSidebar: (state, payload) => {
    state.sidebar = !state.sidebar
  },
  updateResultsCountForTerm: (state, payload) => {
    state.resultsCountForTerm = parseInt(payload)
  },
  updateSearchInProgress: (state, payload) => {
    state.searchInProgress = payload
  },
  updateRequestedPage: (state, payload) => {
    state.requestedPage = payload
  },
  updateRepoInformation: (state, payload) => {
    state.repoInformation = payload
  },
  updateBrowseRepoList: (state, payload) => {
    state.browseRepoList = payload
  }
}

const actions = {
  pushRepoList: (context, payload) => {
    context.commit('updateRepoList', payload)
  },
  updateCurrentSearchTerm: (context, payload) => {
    context.commit('updateCurrentSearchTerm', payload)
  },
  toggleSidebar: (context, payload) => {
    context.commit('toggleSidebar', payload)
  },
  updateResultsCountForTerm: (context, payload) => {
    context.commit('updateResultsCountForTerm', payload)
  },
  updateSearchInProgress: (context, payload) => {
    context.commit('updateSearchInProgress', payload)
  },
  updateRequestedPage: (context, payload) => {
    context.commit('updateRequestedPage', payload)
  },
  updateRepoInformation: (context, payload) => {
    context.commit('updateRepoInformation', payload)
  },
  updateBrowseRepoList: (context, payload) => {
    context.commit('updateBrowseRepoList', payload)
  }
}

const store = () => {
  return new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
  })
}

export default store
