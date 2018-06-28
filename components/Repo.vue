<template>
  <v-card id="repoInfoCard"
          xs10
          offset-xs1>
    <v-card-title id="card-title">{{ repoInformation.name }}</v-card-title>
    <v-chip v-for="topic in repoInformation.topics"
            :small="true"
            :key="topic"
            color="grey darken-2">{{ topic }}</v-chip>
    <v-divider id="topic-desc-divider" />
    <v-card-text>{{ repoInformation.description }}</v-card-text>
    <span id="chips"
          xs10
          offset-xs1>
      <v-chip title="Stars"
              class="chip"
              text-color="grey lighten-4"
              color="grey darken-4">
        <v-avatar class="grey lighten-1">
          <i class="fa fa-star" />
        </v-avatar>
        {{ repoInformation.stargazers_count }}
      </v-chip>

      <v-chip title="Forks"
              class="chip"
              text-color="grey lighten-4"
              color="grey darken-4">
        <v-avatar class="grey lighten-1">
          <i class="fa fa-code-fork" />
        </v-avatar>
        {{ repoInformation.forks_count }}
      </v-chip>

      <v-chip title="Watchers"
              class="chip"
              text-color="grey lighten-4"
              color="grey darken-4">
        <v-avatar class="grey lighten-1">
          <i class="fa fa-eye" />
        </v-avatar>
        {{ repoInformation.subscribers_count }}
      </v-chip>

      <a :href="repoInformation.html_url"
         class="github-link"
         target="_blank">
        <v-chip :title="'Take me to ' + repoInformation.name + ' on GitHub!'"
                class="chip"
                text-color="grey lighten-2"
                color="grey darken-4">
          <v-avatar class="grey lighten-1">
            <i class="fa fa-external-link" />
          </v-avatar>
          @Github
        </v-chip>
      </a>

    </span>
  </v-card>
</template>

<script>
export default {
  props: {
    repoInformation: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
#repoInfoCard {
  min-width: 40%;
  max-width: 80%;
  padding: 15px;
  border: 1px solid black;
}
.chip {
  min-width: 80px;
}
#card-title {
  font-weight: bolder;
  font-size: 160%;
}
.github-link {
  text-decoration: none;
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
