// pages/address_detail/address_detail.js
Page({

  data: {
    aid:{},
    address_detail:{},
    uid:{}
  },

  onLoad: function (options) {
    const {aid} = options;
    console.log(aid);
    let uid = wx.getStorageSync('uid')
    this.setData({aid,uid});
    this.handleChangeAddress(aid) 
  },
  handleChangeAddress(aid){
    if(aid === '' || !aid){
      console.log("dfgfg");
    }
    else{
      wx.request({
        url: 'http://localhost:8080/address/getAddressByAid?aid=' + aid,
        success:(res)=>{
          this.setData({
            address_detail:res.data
          })
        }
      })
    }
  },
  handleAddress(options){
    const {aname,phone,school,building,num,detail} = options.detail.value;
    console.log(aname,phone,school,building,num,detail);
    const {aid,uid} = this.data;
    console.log(aid);
    if(aid === '' || !aid){
      wx.request({
        url: 'http://localhost:8080/address/addAddress',
        data:{
          aname,phone,school,building,num,detail,uid
        }
      })
    }
    else{
      wx.request({
        url: 'http://localhost:8080/address/updateAddress',
        data:{
          aname,phone,school,building,num,detail,aid
        }
      })
    }
    wx.navigateBack({
      delta:1,
     })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})