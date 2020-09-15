<script lang="ts">
import Vue from 'vue';

interface ScrubData {
  width: number;
  height: number;
  duration: number;
  frames: Object;
  currentIndex: String;
  interval: number,
}

export default Vue.extend({
  name: 'ScrubbableVideo',
  data(): ScrubData {
    return {
      width: this.width,
      height: this.height,
      duration: this.duration,
      frames: this.frames,
      currentIndex: this.currentIndex,
      interval: this.interval,
    };
  },
  props: {
    currentProgress: {
      type: Number,
      required: false,
      default: 0,
    },
    framesPerSecond: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  watch: { 
    currentProgress: function(val) {
      let self = this;
      let tmp = self.convertProgressToTime(val).toString();

      if(typeof(self.frames[tmp]) != 'undefined' && self.frames[tmp]['ready']) {
        self.currentIndex = tmp;
      } else {
        self.$emit("frame-unavailable");
      }
    }
  },
  mounted(): void {
    let self = this;
    self.init();
  },
  methods: {
    init():void {
      let self = this;
      self.frames = {};
      self.width = 0;
      self.height = 0;
      let tmp = 1 / self.$props.framesPerSecond;
      self.interval = parseFloat(tmp.toFixed(2));
      self.currentIndex = "0";
    },
    convertProgressToTime(progress: number) {
      let self = this;
      let tmp = self.duration * (progress / 100);
      tmp = self.getNearestIndex(tmp);
      return tmp;
    },
    getNearestIndex(time: number) {
      let self = this;
      let gran = self.interval;
      let tmp = Math.floor(time / gran) * gran;
      tmp = parseFloat(tmp.toFixed(2));
      return tmp;
    },
    generate() {
      let self = this;
      self.$emit("frames-generating");
      self.generateFrames().then(() => {
        self.$emit("frames-ready");
      });
    },
    async generateFrames() {
      return new Promise(async (resolve) => {
        let self = this;

        let seekResolve;
        self.$refs.video.addEventListener('seeked', async function() {
          if(seekResolve) {
            seekResolve();
          }
        });

        // workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
        while((self.$refs.video.duration === Infinity || isNaN(self.$refs.video.duration)) && self.$refs.video.readyState < 2) {
          await new Promise(r => setTimeout(r, 1000));
          self.$refs.video.currentTime = 10000000*Math.random();
        }

        self.width = self.$refs.video.offsetWidth;
        self.height = self.$refs.video.offsetHeight;
        self.duration = self.$refs.video.duration;

        self.currentIndex = self.convertProgressToTime(self.$props.currentProgress).toString();

        let currentTime = 0;
        while(currentTime < self.duration) {
          currentTime = parseFloat(currentTime.toFixed(2));
          self.frames[currentTime.toString()] = {
            "ready": false
          };
          currentTime += self.interval;
        }

        //console.log(self.frames);

        self.$forceUpdate();

        self.$nextTick(async() => {
          currentTime = 0;
          for(let index in self.frames) {
            self.$refs.video.currentTime = parseFloat(index);
            await new Promise(r => seekResolve=r);
            let canvas = self.$refs[`frame_${index}`];
            if(typeof(canvas[0]) != 'undefined' && typeof(canvas[0].getContext) != 'undefined') {
              canvas = canvas[0];
              let context = canvas.getContext('2d');
              context.drawImage(self.$refs.video, 0, 0, self.width, self.height);
              self.frames[index]['ready'] = true;
            }
          }
          return resolve();
        });
      });
    },
  },
});
</script>

<template>
  <div class="vue-scrubbable-video">
    <video ref="video" muted @loadedmetadata="generate">
      <slot />
    </video>
    <canvas :width="width" :height="height" v-for="(frame, index) in frames" :key="`frame_${index}`" :ref="`frame_${index}`" v-bind:class="{ active: currentIndex == index }"></canvas>
  </div>
</template>

<style scoped>
  .vue-scrubbable-video {
    position:relative;
  }
  .vue-scrubbable-video > video {
    max-width:100%;
    visibility:hidden;
    opacity:0;
  }
  .vue-scrubbable-video > canvas {
    position:absolute;
    display:none;
    left:0px;
    top:0px;
  }
  .vue-scrubbable-video > canvas.active {
    display:block;
  }
</style>
