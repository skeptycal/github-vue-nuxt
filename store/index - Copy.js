export const state = () => ({
  sidebar: false,
  repoList: {}
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  pushRepoList (repoList) {
    state.repoList.push(repoList)
  }
}
