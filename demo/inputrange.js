import Vue from 'vue'
import Range from '../src/inputrange.vue'

Vue.component('range', Range);

var demo = new Vue({
    el: "#demo",
    data: {
    	val: 0.6,
        step: 0.02,
        scale: [0,0.5,1]
    }
});
