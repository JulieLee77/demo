/**
 * Created by Julie on 16/6/24.
 */
new Vue({
  el: 'body',
  data: {
    showTip: true
  },
  ready: function () {
    var _this = this;
    this.$els.mainWrapper.addEventListener('touchstart', function () {
      _this.$set('showTip', false);
    }, false);
    this.$els.mainWrapper.addEventListener('touchend', function () {//小米不支持
      _this.$set('showTip', true);
    }, false);
    this.$els.mainWrapper.addEventListener('touchcancel', function () { //iPhone SE 不支持
      _this.$set('showTip', true);
    }, false);
  }
});

