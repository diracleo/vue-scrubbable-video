<!--
  Author: Dane Iracleous <daneiracleous@gmail.com>
  Repository: https://github.com/diracleo/vue-scrubbable-video
-->

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

interface Frame {
  ready: boolean
}

interface Frames {
  [key: string]: Frame
}

export default Vue.extend({
  name: 'ScrubbableVideo',
  data(): ScrubData {
    return {
      width: 0,
      height: 0,
      duration: 0,
      frames: {},
      currentIndex: "0",
      interval: 0,
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
        self.$emit("frame-shown", val, tmp);
      } else {
        self.$emit("frame-unavailable", val, tmp);
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
      self.frames = {} as Frames;
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
      //adapted from https://stackoverflow.com/questions/32699721/javascript-extract-video-frames-reliably/32708998
      return new Promise(async (resolve) => {
        let self = this;
        let seekResolve;
        let video = self.$refs.video as HTMLVideoElement;
        video.addEventListener('seeked', async function() {
          if(seekResolve) {
            seekResolve();
          }
        });

        // workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
        while((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) {
          await new Promise(r => setTimeout(r, 1000));
          video.currentTime = 10000000*Math.random();
        }

        self.width = video.offsetWidth;
        self.height = video.offsetHeight;
        self.duration = video.duration;

        self.currentIndex = self.convertProgressToTime(self.$props.currentProgress).toString();

        let currentTime = 0;
        while(currentTime < self.duration) {
          currentTime = parseFloat(currentTime.toFixed(2));
          let k = currentTime.toString();
          self.frames[currentTime.toString()] = {
            "ready": false
          } as Frame;
          currentTime += self.interval;
        }

        self.$forceUpdate();

        self.$nextTick(async() => {
          currentTime = 0;
          for(let index in self.frames) {
            video.currentTime = parseFloat(index);
            await new Promise(r => seekResolve=r);
            let canvas = self.$refs[`frame_${index}`];
            canvas = canvas[0] as HTMLCanvasElement;
            if(typeof(canvas) != 'undefined' && typeof(canvas.getContext) != 'undefined') {
              let context = canvas.getContext('2d');
              context.drawImage(video, 0, 0, self.width, self.height);
              self.frames[index]['ready'] = true;
              let percent = parseFloat(index) / self.duration * 100;
              self.$emit("frame-ready", percent.toFixed(2), index);
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
