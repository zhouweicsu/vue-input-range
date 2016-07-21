<template lang="jade">
.input-range(@click="move")
  .range
    .track(:style="{width: percentage}")
    .thumb(:style="{left: percentage}", @mousedown="dragStart")
    .value(:style="{left: percentage}")  {{ valFilter(val) }}倍
  ul.mark
    li(v-for="s in scale", :style="{left: _getPercentage(s)}") {{ s }}
</template>

<script>
export default {
  props: {
    step: {
      default: 1
    },
    val: {
      default: 0
    },
    scale: Array
  },
  computed: {
    max () {
      return this.scale[this.scale.length -1];
    },
    min () {
      return this.scale[0];
    },
    precision() {
      return (this.step.toString().split('.')[1] || []).length;
    },
    percentage () {
      if(this.val < this.min) this.val = this.min;
      if(this.val > this.max) this.val = this.max;
      return this._getPercentage(this.val);
    }
  },
  ready () {
    this._getWholeWidth();
    this.offset = this.$el.offsetLeft;
    window.addEventListener('resize', this._getWholeWidth);
  },
  methods: {
    dragStart () {
      document.body.addEventListener('mousemove',this.move);
      document.body.addEventListener('mouseup',this.dragEnd);
    },
    dragEnd () {
      document.body.removeEventListener('mousemove',this.move);
      document.body.removeEventListener('mouseup',this.dragEnd);
    },
    move (e) {
      const me = this;
      const left = e.pageX - me.offset;
      if (left < 0 || left > me.wholeWidth) return false;
      const delta = (left * (me.max-me.min) / me.wholeWidth).toFixed(this.precision+1);
      me.val = (delta % me.step < me.step / 2)
               ? (Math.floor(delta / me.step) * me.step + me.min)
               : (Math.ceil(delta / me.step) * me.step + me.min);
    },
    _getWholeWidth() {
      this.wholeWidth = this.$el.querySelector('.range').offsetWidth;
    },
    _getPercentage(value) {
      return (value - this.min) * 100 / (this.max - this.min) + '%';
    },
    valFilter(val) {
      this.val = parseFloat(val).toFixed(this.precision);
      return this.val;
    }
  },
  destroyed() {
    window.removeEventListener('resize',this._getWholeWidth);
  }
}
</script>

<style lang="sass" src="./inputrange.scss"></style>