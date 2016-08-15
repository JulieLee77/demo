function drawChart(id, data, type) {
  /*
   ** id--- 曲线图元素
   ** data--- 曲线图数据 形式为｛x_axis:[],y_axis:[]｝，x_axis[]  时间戳
   ** type--- 曲线图类型，可选参数 tooltip是否显示
   ** TODO 当有多组y_axis数据时 data｛x_axis:[],y_axis:[[y1][y2]]｝ type [type1,type2] 
   */
  var obj = document.getElementById(id),
    width;
  if (!obj.clientWidth) {
    width = window.innerWidth;
    obj.style.width = width + 'px';
  } else {
    width = obj.clientWidth;
  }
  if (!data.x_axis.length) {
    obj.innerHTML = '<p class="no-data">暂无数据</p>';
    return;
  }
  obj.style.height = width * 0.5 + 'px';

  var hasPercent = data.y_axis[0].indexOf('%') > -1,
    yAxis = [];
  if (hasPercent) {
    for (var i = 0, len = data.y_axis.length; i < len; i++) {
      yAxis.push(parseFloat(data.y_axis[i]).toFixed(4));
    }
  } else {
    yAxis = data.y_axis;
  }

  var chart = echarts.init(obj);
  var option = {
    grid: {
      show: true,
      left: 40,
      top: 10,
      right: 40,
      bottom: 20,
      borderColor: '#f8f8f8',
      boderWidth: 1
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.x_axis,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#c7c7c7'
        },
        interval: function(index, value) {
          var len = data.x_axis.length,
            flag = false;
          if (len <= 7 || index === 0 || index === len - 1) {
            flag = true;
          } else{
            var interval;
            if (value.length > 5) { //YYYY-MM-DD
              interval = parseInt(len / 3);
            } else { //MM-DD
              interval = parseInt(len / 5);
            }
            flag = len - 1 - index > Math.ceil(interval / 2) && !(index % interval);
          }
          return flag;
        }
      },
      splitLine: {
        color: '#f8f8f8'
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: '{value}' + (hasPercent ? '%' : ''),
        textStyle: {
          color: '#c7c7c7'
        }
      },
      splitLine: {
        color: '#f8f8f8'
      }
    },
    series: [{
      type: 'line',
      smooth: true,
      showSymbol: false,
      sampling: 'average',
      lineStyle: {
        normal: {
          color: '#ffb227'
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#ffeea8' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#fff' // 100% 处的颜色
          }], false)
        }
      },
      itemStyle: {
        normal:{
        color: '#5889f9'
        }
      },
      data: yAxis
    }],
    textStyle: {
      color: '#c7c7cc',
      fontFamily: 'Helvertica',
      fontSize: 12
    }
  }
  type && (option.tooltip = {
    trigger: 'axis',
    formatter: '时间：{b}<br>' + type + '：{c}' + (hasPercent ? '%' : ''),
    backgroundColor: '#5889f9',
    textStyle: {
      fontSize: 12
    },
    axisPointer: {
      lineStyle: {
        color: '#5889f9',
        type: 'solid',
        textStyle: {
          color: '#fff',
          fontFamily: 'Helvertica'
        }
      }
    }
  });
  chart.setOption(option);
}