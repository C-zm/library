// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    user:{}
  },

  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({userInfo})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({userInfo})
    console.log("sdfsdfsdf");
    console.log(userInfo);
    
    
  }
})