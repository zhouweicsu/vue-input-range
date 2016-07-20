<template lang="jade">
.range-selector(@click="click($event)")
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
    val: {
      default: 0
    },
    duration: Array
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
      if(this.val < this.min) this.val = this.min;
      if(this.val > this.max) this.val = this.max;
      return (this.val - this.min) * 100 / (this.max - this.min) + '%';
    }
  },
  ready () {
    this.getWholeWidth();
    this.offset = this.$el.offsetLeft;
    window.addEventListener('resize', this.getWholeWidth);
  },
  methods: {
    getWholeWidth() {
      this.wholeWidth = this.$el.querySelector('.range-selector .range').offsetWidth;
    },
    click (e) {
      this.dragStart();
      this.dragMove(e);
      this.dragEnd();
    },
    dragStart () {
      this.dragable = true;
      document.body.addEventListener('mousemove',this.dragMove);
      document.body.addEventListener('mouseup',this.dragEnd);
    },
    dragMove (e) {
      const me = this;
      const left = e.pageX - me.offset;
      if (!me.dragable || left < 0 || left > me.wholeWidth) return false;
      const exactVal = (me.min + left * (me.max-me.min) / me.wholeWidth).toFixed(1);
      me.setVal(exactVal);
    },
    dragEnd () {
      this.dragable = false;
      document.body.removeEventListener('mousemove',this.dragMove);
      document.body.removeEventListener('mouseup',this.dragEnd);
    },
    setVal (exactVal) {
      const me = this;
      let l = me.values[0];
      for(let r of me.values) {
        if(exactVal >= l && exactVal < r) {
          me.val = exactVal > (l + (r - l) * 0.5 / me.step) ? r : l;
          break;
        }
        l = r;
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize',this.getWholeWidth);
  }
}
</script>

<style lang="sass" src="./inputrange.scss"></style>