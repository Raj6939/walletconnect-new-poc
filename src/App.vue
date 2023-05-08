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
        content: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN2vVVG2BOns1aicnn0wKmKn3aYtHCcBiysWlpz_c&s'
      },  
      {
        property: 'og:url',
        content: 'https://joyful-donut-505014.netlify.app/'
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
