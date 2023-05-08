<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App', 
  metaInfo: {
    title: 'Your Page Title',
    meta: [
      {
        property: 'og:title',
        content: 'Your Page Title'
      },
      {
        property: 'og:description',
        content: 'Description of your webpage'
      },
      {
        property: 'og:image',
        content: 'https://media.licdn.com/dms/image/C4D03AQGM3Z9dL6ZkoQ/profile-displayphoto-shrink_800_800/0/1655765136300?e=2147483647&v=beta&t=LuvfT4R4SwW7XmMEXo2e9SIrQ5uKlMs_2saK2Gi_iOI'
      },
      {
        property: 'og:url',
        content: 'URL of your webpage'
      },
      {
        property: 'og:type',
        content: 'website'
      }
    ]
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
