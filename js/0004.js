/**
 * Created by Julie on 16/6/24.
 */
var vm=new Vue({
  el:'body',
  data:{
    tabNames:['Tab1','Tab2','Tab3'],
    tabIndex:0
  },
  computed:{
    clientWidth: function () {
      return parseInt(document.body.clientWidth);
    }
  },
  methods:{

  }
});
vm.$watch('tabIndex', function (newValue, oldValue) {
  if (newValue !== oldValue) {
    document.body.scrollTop = 0;
  }
});
//slide left & right, switch the tab
var xx, yy, XX, YY, swipeX, swipeY;
window.addEventListener('touchstart', function (event) {
  xx = event.targetTouches[0].screenX;
  yy = event.targetTouches[0].screenY;
  swipeX = true;
  swipeY = true;
}, false);
window.addEventListener('touchend', function (event) {
  XX = event.changedTouches[0].screenX;
  YY = event.changedTouches[0].screenY;
  if (swipeX && Math.abs(XX - xx) - Math.abs(YY - yy) > 0) {//左右滑动
    event.stopPropagation();
    event.preventDefault();
    swipeY = false;
    if (XX > xx && vm.tabIndex > 0) {
      vm.tabIndex--;
    } else if (XX < xx && vm.tabIndex < vm.tabNames.length - 1) {
      vm.tabIndex++;
    }
  } else if (swipeY && Math.abs(XX - xx) - Math.abs(YY - yy) < 0) {//上下滑动
    swipeX = false;
  }
});
