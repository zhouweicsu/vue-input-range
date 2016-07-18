import Vue from 'vue'
import Range from '../src/inputrange.vue'

Vue.component('range', Range);

var demo = new Vue({
    el: "#demo",
    data: {
    	val: 1,
        step: 1,
        duration: [1,5,10,15,20]
    }
});
