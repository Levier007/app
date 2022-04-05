<template>
  <div id="app">
    <Header/>
    <router-view></router-view>
    <PlayerBar ></PlayerBar>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/header'
import Footer from './components/footer'
import PlayerBar from './components/playerBar';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    PlayerBar
  }
}
</script>

<style>
@import './assets/styles/reset.css';
@keyframes play {
	0% {
		-webkit-transform: translateY(0);
		transform: translateY(0)
	}

	to {
		-webkit-transform: translateY(85%);
		transform: translateY(85%)
	}
}
</style>
