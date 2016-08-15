var vm = new Vue({
  el: 'body',
  data: {
    periodNames: ['近七日', '近一月', '近三月', '近一年', '成立以来'],
    periods: [7, 30, 90, 365, 'all'],
    periodIndex: null
  },
  ready: function() {
    this.$http.get('js/0006.json').then(function(response) {
      this.$set('incomeratios', response.data);
      this.selPeriod(0);
    }, function(response) {
      console.log('fail' + response.status + ',' + response.statusText);
    });
  },
  methods: {
    toDouble: function(n) {
      return n > 9 ? n : '0' + n;
    },
    transTime: function(time) {
      var date = new Date(time);
      var str = this.toDouble(date.getMonth()) + '-' + this.toDouble(date.getDate());
      if (this.periods[this.periodIndex] == 'all') {
        str = date.getFullYear() + '-' + str;
      }
      return str;
    },
    transAxis: function(array) {
      //[{stamp:,value:}]=> {x_axis:[],y_axis:[]}
      var x_axis = [],
        y_axis = [];
      for (var i = 0, v; v = array[i]; i++) {
        x_axis.push(this.transTime(v.stamp));
        y_axis.push(v.value);
      }
      return {
        x_axis: x_axis,
        y_axis: y_axis
      };
    },
    splitArr: function(array) {
      var period = this.periods[this.periodIndex];
      if (period == 'all') {
        return array;
      }
      var aryLen = array.length;
      var d = new Date(array[aryLen - 1].stamp),
        yy = d.getFullYear(),
        mm = d.getMonth(),
        dd = d.getDate(),
        st_stamp;
      switch (period) {
        case 7:
          st_stamp = new Date(yy, mm, dd + 1 - period).getTime();
          break;
        case 30:
          st_stamp = this.transDay(yy, mm - 1, dd);
          break;
        case 90:
          st_stamp = this.transDay(yy, mm - 3, dd);
          break;
        case 365:
          st_stamp = this.transDay(yy - 1, mm, dd);
          break;
      }
      var arr = [];
      for (var i = aryLen - 1; i >= aryLen - period; i--) {
        if (array[i] && array[i].stamp >= st_stamp) {
          arr.unshift(array[i]);
        } else {
          break;
        }
      }
      if (period != 7 && array[i] && array[0] != st_stamp) {
        arr.unshift(array[i]);
      }
      return arr;
    },
    transDay: function(yy, mm, dd) {
      if (dd <= 28) {
        return new Date(yy, mm, dd).getTime();
      }
      //考虑dd>28的情况
      var year = yy,
        month = mm,
        day;
      if (mm < 0) {
        year = yy - 1;
        month = mm + 12;
      }
      if (month == 1) {
        day = !(year % 400) || (year % 100 && !(year % 4)) ? 29 : 28;
      } else if (month == 3 || month == 5 || month == 8 || month == 10) { //月30天
        day = dd > 31 ? 30 : dd;
      } else { //月31天
        day = dd;
      }
      return new Date(year, month, day).getTime();
    },
    selPeriod: function(index) {
      if (index === this.periodIndex) {
        return;
      }
      this.periodIndex = index;
      !this['data' + this.periodIndex] && (this['data' + this.periodIndex] = this.transAxis(this.splitArr(this.incomeratios)));
      drawChart('main', this['data' + this.periodIndex], '七日年化');
    }
  }
});