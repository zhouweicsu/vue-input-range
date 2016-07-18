<template lang="jade">
.range-selector(@click="click($event, this)")
  .range
    .select-range(:style="{width: ratio}")
    .current(:style="{left: ratio}", @mousedown="dragStart(this)") {{ val }}倍
  ul.range-num
    li(v-for="i in duration", :style="{left: ((i - min) * 100 /(max - min)) + '%'}") {{ i }}
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
      wholeWidth: 1,
      offsetLeft: 0,
      exactVal: 0,
      dragable: false
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
      return this.offsetLeft * 100 / this.wholeWidth + '%'
    }
  },
  ready () {
    let self = this;
    if(this.val < this.min) this.val = this.min;
    self.wholeWidth = document.querySelector('.range-selector .range').offsetWidth;
    document.body.addEventListener('mousemove',function (e) {
      self.dragMove(e, self);
    });
    document.body.addEventListener('mouseup',function (e) {
      self.dragEnd(e, self);
    });
  },
  methods: {
    click: (e, self) => {
      self.dragStart(self);
      self.dragMove(e,self);
      self.dragEnd(e,self);
    },
    dragStart: (self) => {
      self.dragable = true;
    },
    dragMove: (e, self) => {
      if (!self.dragable) return false;
      let left = e.clientX - e.target.parentNode.offsetLeft;
      if (left < 0 || left > self.wholeWidth) return false;
      self.offsetLeft = left;
      self.exactVal = (self.min + self.offsetLeft * (self.max-self.min) / self.wholeWidth).toFixed(1);
      self.getValByOffset(self.offsetLeft, self);
    },
    dragEnd: (e, self) => {
      self.getValByOffset(self.offsetLeft, self);
      self.offsetLeft = (self.val - self.min) * self.wholeWidth / (self.max - self.min);
      self.dragable = false;
    },
    getValByOffset: (offsetLeft, self) => {
      let left = self.values[0];
      for(let right of self.values) {
        if(self.exactVal >= left && self.exactVal < right) {
          self.val = self.exactVal > (left + (right - left) * 0.5 / self.step) ? right : left;
          break;
        }
        left = right;
      }
    }
  }
}
</script>

<style lang="sass">
$primary-color: #2196f3;
$dragger-size: 20px;
$dragger-color: white;
$range-size: 10px;

ul {
  list-style: none;
}

ul, p {
  padding: 0;
  margin: 0;
}
.range-selector {
  width: 100%;
  font-size: inherit;
  user-select: none;
  cursor: pointer;

  .range {
    position: relative;
    width: 100%;
    height: $range-size;
    background: lighten($primary-color, 30%);
    border-radius: $range-size;
    margin-top: 20px;

    .select-range {
      background: $primary-color;
      border-radius: $range-size;
      height: 100%;
    }

    .current {
      position: absolute;
      color: $primary-color;
      top: -1em;
      z-index: 1;
      transform: translate(-$dragger-size/2, -$dragger-size/2);
      cursor: pointer;
      &.transition {
        transition: all .3s ease;
      }
      &:after {
        content: '‖';
        background: $dragger-color;
        box-shadow: 0 0 10px -2px #eee;
        display: block;
        width: $dragger-size;
        height: $dragger-size;
        line-height: $dragger-size;
        text-align: center;
        border-radius: $dragger-size;
        margin-top: 5px;
      }
    }
  }

  .range-num {
    color: $primary-color;
    position: relative;
    width: 100%;
    cursor: pointer;
    li {
      position: absolute;
      top: -$range-size;
      transform: translate(-100%, 0);
      &:first-child {
        transform: translate(0, 0);
        z-index: -1;
      }
      &:last-child {
        z-index: -1;
      }
      &:before {
        width: 2px;
        height: $dragger-size;
        background: #fff;
        content: ' ';
        display: block;
        margin: auto;
      }
    }
  }
}
</style>
