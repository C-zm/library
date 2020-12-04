// pages/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:1,
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
  },
  
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo);
    this.setData({userInfo})
  },
  change_pwd(){
    const {userInfo} = this.data
    console.log(userInfo.pwd);
    this.setData({state_code:2})
    this.showInputLayer();
  },
  change_account(){
    const {userInfo} = this.data
    console.log(userInfo.pwd);
    this.setData({state_code:3})
    this.showInputLayer();
  },
    /**
   * 显示支付密码输入层
   */
  showInputLayer: function(a){
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function(pwdVal){
    /**获取输入的密码**/
    const {pwd,account,uid} = this.data.userInfo;
    const {state,state_code} = this.data;
    var b = pwd.toString();
    /**在这调用支付接口**/
    if (pwdVal === b && state === 1){
      this.setData({state:state_code,pwdVal:''})
      this.showInputLayer()
    }
    else if(state === 2 ){
      this.setData({state:1,showPayPwdInput: false, payFocus: false,pwdVal:''})
      if(pwdVal.length === 6){
        wx.request({
          url: 'http://localhost:8080/user/updateUser',
          data:{uid,pwd:pwdVal},
          success:()=>{
            wx.request({
              url: 'http://localhost:8080/user/getUserByUid?uid=' + uid,
                success:(res)=>{
                  wx.setStorageSync('userInfo', res.data),
                  this.setData({userInfo:res.data, pwdVal: '',})
                }
            })
          }
        })
        
      wx.showToast({
        title: '修改成功',icon:"success",mask:true
      })
      }
    }
    else if(state === 3){
      this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' ,state:1});
       const account1 = parseInt(account) + parseInt(pwdVal.currentTarget.dataset.account);
      wx.request({
        url: 'http://localhost:8080/user/updateUser',
        data:{uid,account:account1},
        success:()=>{
          wx.request({
            url: 'http://localhost:8080/user/getUserByUid?uid=' + uid,
              success:(res)=>{
                wx.setStorageSync('userInfo', res.data),
                this.setData({userInfo:res.data, pwdVal: '',})
              }
          })
        }
      })
      wx.showToast({
        title: '修改成功',icon:"success",mask:true
      })
    }
    else if(pwdVal !== b && pwdVal.length === 6){
      wx.showToast({
        title: '密码错误',icon:"none",mask:true
      })
      this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' });
    }
    else{
      this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' ,state:1});
    }
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
    this.setData({ pwdVal });
    const {state} = this.data
    if(state === 1 || state === 2){
      if (pwdVal.length >= 6){
        this.hidePayLayer(pwdVal);
      }
    }
  },

  handleuser(e){
    const {uid,uname,uphone} = e.detail.value;
    wx.request({
      url: 'http://localhost:8080/user/updateUser',
      data:{uid,uname,uphone},
      success:()=>{
        wx.request({
          url: 'http://localhost:8080/user/getUserByUid?uid=' + uid,
            success:(res)=>{
              wx.setStorageSync('userInfo', res.data),
              this.setData({userInfo:res.data,})
                 wx.showToast({
                  title: '修改成功',icon:"success",mask:true,duration:1000
                })
              wx.navigateBack({
                delta: 1,
              })
            }
        })
      }
    })
 
    
  }
})