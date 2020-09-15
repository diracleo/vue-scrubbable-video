# vue-scrubbable-video

Have you ever tried to scrub through an HTML5 `<video>` element by dynamically changing its currentTime property, only to be disappointed by its slow performance and stuttering behavior?

Have you ever wanted to mimic the smooth and responsive video scrubbing-by-scrollbar seen on the [Apple AirPods Pro Website](https://www.apple.com/airpods-pro/), but without the overhead of parsing out JPEG's from your videos and serving them frame-by-frame?

Now you can! Simply replace your `<video>` element with a `<scrubbable-video>` component.

![](demo1.gif)

## Features

  * Scrub through a video seamlessly without any stuttering
  * Specifying sources is the same as with a normal `<video>` element
  * Specify the frames-per-second to balance performance and quality
  * Scrubbing is possible even before all frames have been generated
  * Connect your own scrubbing controls or tether playback to a scrollbar

![](demo2.gif)

## Requirements

- [Vue.js](https://github.com/vuejs/vue)

## Installation

### npm

```bash

$ npm install @diracleo/vue-scrubbable-video

```

### external script

```html

<script src="https://unpkg.com/@diracleo/vue-scrubbable-video/dist/vue-scrubbable-video.min.js"></script>

```

## Usage

main.js:

```javascript

import Vue from 'vue'
import App from './App.vue'
import ScrubbableVideo from '@diracleo/vue-scrubbable-video';

Vue.use(ScrubbableVideo)

new Vue({
  el: 'body',
  components: {
    App
  }
})

```

template:

```html

<scrubbable-video :currentProgress="myVar" :framesPerSecond="10">
  <source src="/path/to/your/video.mp4" type="video/mp4" />
  <source src="/path/to/your/video.webm" type="video/webm" />
</scrubbable-video>

```

Note that in this example, you will need to dynamically populate the "myVar" variable with a value representing the scrub position of the video in percentage form (0 to 100). 

[scrollmagic.io](https://scrollmagic.io/) is a great library if you want your video scrubbing to be controlled by a scrollbar.

[Slider HTML Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) can be used if you're looking for a more traditional scrubbing controller. 

## Properties

| Property           | Type                        | Default           | Required | Description                              |
| ------------------ | --------------------------- | ----------------- | -------- | ---------------------------------------- |
| currentProgress    | Number (min: 0, max: 100)   | 0                 | *no*     | Percentage-based current scrubbed position   |
| framesPerSecond    | Number (min: 0)             | 10                | *no*     | Granularity of frame-snapshotting            |


## Events

| Name                  | Arguments                                | Description                                          |
| --------------------- | ---------------------------------------- | ---------------------------------------------------- |
| **frame-unavailable** | Number                                   | Fired when an unready frame has been scrubbed-to     |
| **frame-shown**       | Number                                   | Fired when a ready frame has been scrubbed-to        |
| **frames-generating** | None                                     | Fired when frame generating has begun                |
| **frame-ready**       | Number                                   | Fired when a frame has been generated                | 
| **frames-ready**      | None                                     | Fired when all frames have been generated            | 