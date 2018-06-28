<template>
  <v-layout>
    <v-flex>
      <v-data-table :headers="headers"
                    :items="browseRepoList"
                    :rows-per-page-items="[10]"
                    @update:pagination="getResultsIfLastPage">
        <template slot="headerCell"
                  scope="props">
          <v-tooltip bottom>
            <span slot="activator">
              {{ props.header.text }}
            </span>
            <span>
              {{ props.header.text }}
            </span>
          </v-tooltip>
        </template>
        <template slot="items"
                  scope="props"
                  @click.native="$router.go(`/repos/${props.item.id}`)">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.owner.login }}</td>
          <td>{{ props.item.description }}</td>
        </template>
        <template slot="no-data">
          Loading Results...
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import gitHubAPI from "~/plugins/gitHubAPI"
import store from "~/store"
// import { mapGetters } from 'vuex'

const theStore = store()

// An example where I am not sure if using the store is needed
let nextSince = 0

export default {
  data() {
    return {
      headers: [
        { text: "Name", sortable: false },
        { text: "Owner", sortable: false },
        { text: "Description", sortable: false, align: "left" }
      ]
    }
  },
  computed: {
    browseRepoList() {
      if (theStore.getters.browseRepoList.length < 1) {
        this.loadRepositories(nextSince)
      }
      return theStore.getters.browseRepoList
    },
    pages() {
      return this.pagination
    }
  },
  methods: {
    getResultsIfLastPage(event) {
      if (
        theStore.getters.browseRepoList.length / event.rowsPerPage ===
        event.page
      ) {
        this.loadRepositories(nextSince, true)
      }
    },
    loadRepositories(sinceID, isConcat) {
      const params = {
        since: sinceID
      }

      gitHubAPI.fetchRepositories(
        params,
        function(response) {
          // success
          nextSince = response.headers.nextSince
          if (isConcat) {
            let currentRepoList = theStore.getters.browseRepoList
            theStore.commit(
              "updateBrowseRepoList",
              currentRepoList.concat(response.data)
            )
            return
          }
          theStore.commit("updateBrowseRepoList", response.data)
        },
        function() {
          // fail
        }
      )
    }
  }
}
</script>
