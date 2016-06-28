/**
 * Created by Julie on 16/6/24.
 */
window.onload = function () {
  var canvas = document.querySelector('canvas'),tip=document.querySelector('h4');
  var val1 = 22, val2 = 120, val3 = 218;
  var gestureArr = [
    {x: val1, y: val1}, {x: val2, y: val1}, {x: val3, y: val1},
    {x: val1, y: val2}, {x: val2, y: val2}, {x: val3, y: val2},
    {x: val1, y: val3}, {x: val2, y: val3}, {x: val3, y: val3}
  ];
  var moveIndex = [], touching = true, ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineWidth = 1;
  var offsetX = canvas.offsetLeft, offsetY = canvas.offsetTop;

  function drawCircle(pos, radius, isFill) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    if (isFill) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }

  function computedIndex(x, y) {
    var index = -1;
    for (var i = 0, pos; pos = gestureArr[i]; i++) {
      if (Math.abs(pos.x + offsetX - x) <= 22 && Math.abs(pos.y + offsetY - y) <= 22) {
        index = i;
        break;
      }
    }
    return index;
  }

  canvas.addEventListener('touchstart', function (event) {
    if (!touching) {
      return;
    }
    var index = computedIndex(event.touches[0].clientX, event.touches[0].clientY);
    if (index === -1) {
      return;
    }
    drawCircle(gestureArr[index], 5, true);
    moveIndex.push(index);
  }, false);
  canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    if (!touching) {
      return;
    }
    var index = computedIndex(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
    if (index === -1) {
      return;
    }
    drawCircle(gestureArr[index], 5, true);

    if (moveIndex.length > 1) {
      var lastIndex = moveIndex.slice(-1);

      ctx.beginPath();
      ctx.moveTo(gestureArr[lastIndex].x, gestureArr[lastIndex].y);
      ctx.lineTo(gestureArr[index].x, gestureArr[index].y);
      ctx.closePath();
      ctx.stroke();
    }
    moveIndex.push(index);
  });
  canvas.addEventListener('touchend', function () {
    touching = false;
    //判断密码是否正确
    //错误
    ctx.strokeStyle = '#f24848';
    for (var i = 0; i < moveIndex.length; i++) {
      drawCircle(gestureArr[moveIndex[i]], 21, false);
    }
    tip.innerHTML='密码错误';
    ctx.stokeStyle = '#fff';

    setTimeout(function(){
      ctx.restore();
      tip.innerHTML='请解锁';
    },2000);
  }, false);

  for (var i = 0; i < gestureArr.length; i++) {
    drawCircle(gestureArr[i], 21, false);
  }
  ctx.save();
};
