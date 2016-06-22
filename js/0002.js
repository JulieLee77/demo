/**
 * Created by Julie on 16/6/22.
 */
var vm = new Vue({
  el: 'body',
  data: {
    pwdLength: 6,
    inputPwd: false,
    paying: false,
    lockPwd: false,
    lastCode: null,
    showTip: false,
    list: null
  },
  methods: {
    tooltip: function (str) {
      this.showTip = true;
      var _this = this;
      setTimeout(function () {
        _this.$els.tip.innerHTML = str;
      }, 100);
      setTimeout(function () {
        _this.$els.tip.innerHTML = '';
        _this.showTip = false;
      }, 2000);
    },
    showInputPwd: function () {
      if (this.lastCode === 2013) {
        this.lockPwd = true;
        return;
      }
      var _this = this;
      $.ajax({
          url: 'js/0002.json',
          method: 'GET',
          async: false//solve ios focus() bug
        })
        .done(function (data) {
          if (data.code === 2013) {//支付密码已锁定
            _this.lockPwd = true;
            _this.lastCode = data.code;
          } else if (data.code === 0) {
            _this.inputPwd = true;
            _this.$set('pwd', null);
            setTimeout(function () {
              if (!_this.list) {
                _this.list = document.querySelectorAll('.pwd-box li');
                var width = document.querySelector('.pwd-box').clientWidth / 6;
                for (var i = 0, v; v = _this.list[i]; i++) {
                  v.style.height = width + 'px';
                }
              }
            }, 100);
           _this.$els.pwd.focus();
          }
        })
        .fail(function (error) {
          console.log('fail' + ',' + error);
        });
    },
    pwdKeyDown: function (event) {
      var returnVal = true;
      if (event.keyCode >= 48 && event.keyCode <= 57) { //0-9ss
        (this.pwd !== null && this.pwd !== undefined && this.pwd.length == this.pwdLength) && (returnVal = false); //密码已输完,禁止继续输入
      } else if (event.keyCode === 13) {//enter
        this.pwd !== null && this.pwd !== undefined && this.pwd.length === this.pwdLength && this.submitPlan();//若已输完6位,则enter提交
      } else if (event.keyCode !== 8 && event.keyCode !== 46) {//非 delete & backspace
        returnVal = false;
      }
      event.returnValue = returnVal;
    },
    focusPwd: function () {
      this.$els.pwd.focus();
    },
    isPwdError: function (code, msg) {
      if (code === 1011) { //支付密码输入错误
        this.$set('pwd', null);
        var msgArr = msg.split('，');
        this.tooltip('<p>' + msgArr[0] + '</p><p>' + msgArr[1] + '</p>');
      } else {
        document.activeElement.blur();
        this.inputPwd = false;
        if (code === 2013) {//支付密码已锁定
          this.lockPwd = true;
          this.lastCode = code;
        } else {
          this.tooltip('<p>' + msg + '</p>');
        }
      }
    },
    submitPlan: function () {
      //模拟密码输入错误
      this.paying=true;
      var _this=this;
      $.ajax('js/0002_error.json')
        .done(function (data) {
          _this.paying=false;
          if (data.code === 0) {
            location.href = '';
          } else {
            _this.isPwdError(data.code, data.msg);
          }
        })
        .fail(function (error) {
          _this.paying=false;
          console.log('fail' + ',' + error);
        });
      this.$els.pwd.focus();
    }
  }
});

window.reload = function () {
  $.get('0002.json')
    .done(function (data) {
      (!vm.lastCode || vm.lastCode != data.result.code) && location.reload();
    })
    .fail(function (error) {
      console.log(error);
    });
};


