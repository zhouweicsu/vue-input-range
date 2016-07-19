<template lang="jade">
.range-selector(@click="click($event, this)")
  .range
    .select-range(:style="{width: ratio}")
    .resizer(:style="{left: ratio}", @mousedown="dragStart")
      .dragger  {{ val }}倍
  ul.range-num
    li(v-for="d in duration", :style="{left: ((d - min) * 100 /(max - min)) + '%'}") {{ d }}
</template>

<script>
export default {
  props: {
    step: {
      default: 1
    },
    duration: Array,
    val: {
      default: 0
    }
  },
  data () {
    return {
      offsetLeft: 0
    }
  },
  computed: {
    max () {
      return this.duration[this.duration.length -1];
    },
    min () {
      return this.duration[0];
    },
    values () {
      let range = [this.min];
      let i = 0;
      while (range[i] + this.step < this.max) {
        range.push(range[i++] + this.step);
      }
      range.push(this.max);
      return range;
    },
    ratio () {
      return (this.offsetLeft * 100 / this.wholeWidth || 0) + '%';
    }
  },
  ready () {
    const me = this;
    if(this.val < this.min || this.val > this.max) this.val = this.min;
    me.wholeWidth = this.$el.querySelector('.range-selector .range').offsetWidth;
    me.offset = this.$el.offsetLeft;
    window.addEventListener('resize', function(){
      me.wholeWidth = me.$el.querySelector('.range-selector .range').offsetWidth;
    });
  },
  methods: {
    click (e) {
      this.dragStart();
      this.dragMove(e);
      this.dragEnd(e);
    },
    dragStart () {
      this.dragable = true;
      document.body.addEventListener('mousemove',this.dragMove);
      document.body.addEventListener('mouseup',this.dragEnd);
    },
    dragMove (e) {
      const me = this;
      if (!me.dragable) return false;
      const left = e.pageX - me.offset;
      if (left < 0 || left > me.wholeWidth) return false;
      me.offsetLeft = left;
      me.exactVal = (me.min + me.offsetLeft * (me.max-me.min) / me.wholeWidth).toFixed(1);
      me.getValByOffset(me.offsetLeft);
    },
    dragEnd (e) {
      const me = this;
      me.getValByOffset(me.offsetLeft);
      me.offsetLeft = (me.val - me.min) * me.wholeWidth / (me.max - me.min);
      me.dragable = false;
      document.body.removeEventListener('mousemove',me.dragMove);
      document.body.removeEventListener('mouseup',me.dragEnd);
    },
    getValByOffset (offsetLeft) {
      const me = this;
      let l = me.values[0];
      for(let r of me.values) {
        if(me.exactVal >= l && me.exactVal < r) {
          me.val = me.exactVal > (l + (r - l) * 0.5 / me.step) ? r : l;
          break;
        }
        l = r;
      }
    }
  }
}
</script>

<style lang="sass" src="./inputrange.scss"></style>