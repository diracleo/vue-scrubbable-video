<script lang="ts">
import Vue from 'vue';
import ScrubbableVideo from '@/vue-scrubbable-video.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    ScrubbableVideo
  },
  data: function() {
    return {
      value: 0,
    };
  },
  computed: {
    total: function () {
      return parseFloat(this.value);
    },
  },
  methods: {
    outputEvent(str: String) {
      console.log(str);
    },
    scroll() {
      var tmp = this.$refs.app.scrollTop / (this.$refs.inner.offsetHeight - this.$refs.app.offsetHeight) * 100;
      this.value = tmp;
    }
  }
});
</script>

<template>
  <div id="app" @scroll="scroll" ref="app">
    <div ref="inner">
      <div id="scrubber">
        <scrubbable-video :currentProgress="total" :framesPerSecond="10" @frames-generating="outputEvent('frames generating')" @frames-ready="outputEvent('all frames ready')" @frame-unavailable="outputEvent('attempt to display unready frame')">
          <source src="https://dane-iracleous-portfolio.s3-us-west-2.amazonaws.com/stock/jellyfish.mp4" type="video/mp4" />
          <source src="https://dane-iracleous-portfolio.s3-us-west-2.amazonaws.com/stock/jellyfish.webm" type="video/webm" />
        </scrubbable-video>
        <input type="range" min="0" max="100" value="0" class="slider" id="myRange" v-model="value" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  #app {
    position:fixed;
    top:0px;
    left:0px;
    width:100vw;
    height:100vh;
    overflow-x:hidden;
    overflow-y:auto;
  }
  #app > div {
    height:1000vh;
  }
  #scrubber {
    position:fixed;
    left:20px;
    top:20px;
    width: calc(100% - 55px);
    height: calc(100vh - 40px);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
  }
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 25px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    margin:0px;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #000000;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #000000;
    cursor: pointer;
  }
</style>
