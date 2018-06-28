<style>
#container {
  margin-top: 120px;
}
</style>

<template>
  <v-container id="container"
               fill-height>
    <v-layout align-center
              justify-center>
      <repo :repo-information="repoInformation"/>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from "vuex"
import Repo from "~/components/repo"
export default {
  components: {
    Repo
  },
  head: { title: "Repo Information" },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch({ store, params }) {
    await store.dispatch("loadRepositoryInformationFromAPI", params.id)
  },
  computed: {
    ...mapState(["repoInformation"])
  }
}
</script>
