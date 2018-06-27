<style>
    #repoInfoCard {
      min-width: 40%;
      max-width: 80%;;
      padding: 15px;
      border: 1px solid black;
    }
    #container {
      margin-top: 120px;
    }
    .chip {
      min-width: 80px;
    }
    #card-title {
      font-weight: bolder;
      font-size: 160%;
    }
    .github-link {
      text-decoration: none
    }
    #topic-desc-divider {
      background-color: #262626;
      margin-top: 10px;
    }
    .fa {
      /* FA icon color */
      color: #212121;
    }
</style>


<!-- todo: learn how to make this into a contained component so we can do things like put it in a modal -->


<template>
  <v-container fill-height id="container">
    <v-layout align-center justify-center>
      <v-card id="repoInfoCard" xs10 offset-xs1 >
        <v-card-title id="card-title">{{repoInformation.name}}</v-card-title>
        <v-chip v-for="topic in repoInformation.topics" :small="true" color="grey darken-2">{{topic}}</v-chip>
        <v-divider id="topic-desc-divider"></v-divider>
        <v-card-text>{{repoInformation.description}}</v-card-text>
        <span id="chips" xs10 offset-xs1>
          
          <v-chip title="Stars" class="chip" text-color="grey lighten-4" color="grey darken-4">
            <v-avatar class="grey lighten-1"><i class="fa fa-star"></i></v-avatar>
            {{repoInformation.stargazers_count}}
          </v-chip>

          <v-chip title="Forks"  class="chip" text-color="grey lighten-4" color="grey darken-4">
            <v-avatar class="grey lighten-1"><i class="fa fa-code-fork"></i></v-avatar>
            {{repoInformation.forks_count}}
          </v-chip>

          <v-chip title="Watchers" class="chip" text-color="grey lighten-4" color="grey darken-4">
            <v-avatar class="grey lighten-1"><i class="fa fa-eye"></i></v-avatar>
            {{repoInformation.subscribers_count}}
          </v-chip>

          <a class="github-link" :href="repoInformation.html_url" target="_blank">
            <v-chip  :title="'Take me to ' + repoInformation.name + ' on GitHub!'" class="chip" text-color="grey lighten-2" color="grey darken-4">
              <v-avatar class="grey lighten-1"><i class="fa fa-external-link"></i></v-avatar>
              @Github
            </v-chip>
          </a>

        </span>
      </v-card>
      
    </v-layout>
  </v-container>
</template>

<script>
  import 'font-awesome/css/font-awesome.css'
  import store from '~/store'
  import gitHubAPI from '~/plugins/gitHubAPI'

  const theStore = store()

  export default {
    head: {'title': 'Repo Information'},
    data () {
      return {

      }
    },
    computed: {
      repoInformation () {
        // props: name, description, forks_count, stargazers_count, subscribers_count, topics, html_url
        let repoInformation = theStore.getters.repoInformation
        for (let propName in repoInformation) {
          // Comma notate ints for counts
          if (propName.includes('count')) {
            repoInformation[propName] = repoInformation[propName].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
        }
        return theStore.getters.repoInformation
      }
    },
    beforeMount () {
      if (this.getRepoID() === '') {
        // repoID param not defined, redirect to index
        return window.location.replace(location.protocol + '//' + location.host)
      }
      this.loadRepositoryInformationFromAPI(this.getRepoID())
    },
    methods: {
      getRepoID: function () {
        // Todo: This is inefficient. What could be done better via the router?
        if (process.client) {
          return window.location.pathname.split('/')[2]
        }
      },
      loadRepositoryInformationFromAPI: function (repoID) {
        let successCb = function (response) {
          /* eslint-disable */ // for camelCase lint. We don't need everything from the API
          let props = (({ name, description, forks_count, stargazers_count, subscribers_count, topics, html_url }) => 
            ({ name,  description, forks_count, stargazers_count, subscribers_count, topics, html_url }))(response.data)
          /* eslint-enable */
          document.title = 'Repo - ' + props.name
          theStore.commit('updateRepoInformation', props)
        }
        gitHubAPI.repoInformationFromID(repoID, successCb)
      }
    }
  }
</script>