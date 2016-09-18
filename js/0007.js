new Vue({
  el: 'body',
  data: {
    pageIndex: null,
    limit: 10,
    pageNumber: 20,
    items: null
  },
  created: function() {
    this.selPage(1);
  },
  methods: {
    getItems: function() {
      this.$http.get('js/0007.json?page=' + this.pageIndex + '&limit=' + this.limit).then(function(response) {
        this.items = response.data;
      }, function(response) {
        console.log('fail' + response.status + ',' + response.statusText);
      })
    },
    prev: function() {
      if (this.pageIndex > 1) {
        this.pageIndex--;
        this.$nextTick(this.watchPageIndex);
        this.getItems();
      }
    },
    next: function() {
      if (this.pageIndex < this.pageNumber) {
        this.pageIndex++;
        this.$nextTick(this.watchPageIndex);
        this.getItems();
      }
    },
    selPage: function(index) {
      if (index != this.pageIndex) {
        this.pageIndex = index;
        this.$nextTick(this.watchPageIndex);
        this.getItems();
      }
    },
    watchPageIndex: function() {
      if (this.pageNumbers <= this.limit) {
        return;
      }
      var spanList = document.querySelectorAll('.pagination li span');
      var indexList = [];
      for (var i = 0, v; v = spanList[i]; i++) {
        var index = parseInt(v.getAttribute('data-index'));
        indexList.push(index);
        i > 0 && index - indexList[i - 1] > 1 ? spanList[i].classList.remove('hide') : spanList[i].classList.add('hide');
      }
    }
  }
});