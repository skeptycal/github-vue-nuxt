import axios from "axios"
const ENV_DEV = process.env.NODE_ENV !== "production"

let credentials = {
  // Rate: ~30 req per minute
  username: "api-access",
  password: "505cd0a2c6aef641f1b1ce0be4b7ecddd899c743"
}

let gitHubAPI = {
  setCredentials(username, password) {
    credentials.username = username
    credentials.password = password
  },
  fetchRepositories(params, success, fail) {
    /*
      @arg params.since {int} [ pagination ]
      @return {obj} [ Response ]
          @prop response.headers.nextSince  {int}  [ Last ID In List ]
    */
    axios
      .get("https://api.github.com/repositories", {
        params: params,
        auth: credentials // Sets Authentication Header
      })
      .then(function(response) {
        // Get next page param "since={int}" from rel=next header
        response.headers.nextSince = response.headers.link
          .substr(0, response.headers.link.indexOf(">"))
          .match(/\d+/)[0]
        success(response)
      })
      .catch(function(error) {
        if (ENV_DEV) console.log(error)
        if (error.response.status === 403) {
          fail()
        }
      })
  },
  repoSearchByTerm(params, success, fail) {
    /*
      @arg params.q {str} [ Query term ]
      @return {obj} [ Response ]
    */
    axios
      .get("https://api.github.com/search/repositories", {
        params: params,
        auth: credentials // Sets Authentication Header
      })
      .then(function(response) {
        success(response)
      })
      .catch(function(error) {
        if (ENV_DEV) console.log(error)
        if (error.response.status === 403) {
          fail()
        }
      })
  },
  async repoInformationFromID(repoID) {
    /*
      @arg {int} [ repository ID ]
      @return {obj} [ Response ]
    */
    return await axios
      .get(`https://api.github.com/repositories/${repoID}`, {
        headers: {
          Accept: "application/vnd.github.mercy-preview+json" // So that we get the topics
        },
        auth: credentials // Sets Authentication Header
      })
      .then(function(res) {
        return res
      })
  }
}

export default gitHubAPI
