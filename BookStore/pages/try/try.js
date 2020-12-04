const app = getApp()
 
Page({
  data: {
    pingTime: "2020-7-2 16:35:00", 
    t: "00:15:00",
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
    a: 222222
  },
  onLoad: function () {
    this.setCountDown()
},
  /**
   * 显示支付密码输入层
   */
  showInputLayer: function(){
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function(pwdVal){
    /**获取输入的密码**/
    const {a} = this.data
    var b = a.toString()
    /**在这调用支付接口**/
    if (pwdVal === b){
      wx.showToast({
        title: '支付成功',
      })
    }else{
      wx.showToast({
        title: '支付失败',
      })
    }
    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' });
 
  },
  /**
   * 获取焦点
   */
  getFocus: function(){
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e){
    let pwdVal = e.detail.value
      this.setData({ pwdVal: e.detail.value });
      if (e.detail.value.length >= 6){
        this.hidePayLayer(pwdVal);
      }
  },


  setCountDown: function () {
    let time = 1000;
    let { pingTime } = this.data;
    var msec = this.queryTime(pingTime)
    if (msec <= 0){
      this.setData({countDown:"计时已结束"})
    }else{
      var formatTime = this.getFormat(msec)
      var countDown = `${formatTime.hour}:${formatTime.min}:${formatTime.second}`;
      this.setData({countDown})
      setTimeout(this.setCountDown, time);
    }
  },
  
    /**
    * 格式化时间
    */
    getFormat: function (msec) {
      let second = parseInt(msec / 1000);
      let min = 0;
      let hour = 0;
      let day = 0;
      let mouth = 0;
      let year = 0;
      if (second > 60) {
        min = parseInt(second / 60);
        second = parseInt(second % 60);
        if (min > 60) {
          hour = parseInt(min / 60);
          min = parseInt(min % 60);
          if (hour > 24){
            day = parseInt(hour / 24);
            hour = parseInt(hour % 24);
            if (day > 30){
              mouth = parseInt(day / 30);
              day = parseInt(day % 30);
              if (mouth > 12){
                year = parseInt(mouth / 12)
                mouth = parseInt(mouth % 12)
              }
            }
          }
        }
      }
      second = second > 9 ? second : `0${second}`;
      min = min > 9 ? min : `0${min}`;
      hour = hour > 9 ? hour : `0${hour}`; 
      return { second, min, hour};
    },
    queryTime:function(pintime){
      let start_date = new Date();
      var end_date = new Date(pintime.replace(/-/g, "/"));
      console.log(start_date.getTime());
      console.log( end_date.getTime());
      var days = end_date.getTime() + 900000  - start_date.getTime();
      return days;
    },
 
})