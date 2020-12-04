// pages/address/address.js
Page({

  data: {
    address:[],
    start:0,
    end:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var a = 1
    this.getAddress(a)
  },

  getAddress(a){
    let uid = wx.getStorageSync('uid');
    wx.request({
      url: 'http://localhost:8080/address/getAddressByUid?uid=' + uid,
      success:(res)=>{
        const index = res.data.findIndex(v=>v.isuse)
        wx.setStorageSync('address', res.data[index])
        this.setData({
          address:res.data
        })
        if(a === 2){
          wx.navigateBack({
          delta: 1,
        })}
      }
    })
  },

  chooseAddress(e){
    let {address} = this.data;
    const index =  address.findIndex(v=>v.isuse === true);
    if(address[index]){
      wx.request({
        url: 'http://localhost:8080/address/updateAddress',
        data:{
          aid:address[index].aid,
          isuse:false
        },
      })
    }
    const {aid} = e.currentTarget.dataset
    wx.request({
      url: 'http://localhost:8080/address/updateAddress',
      data:{aid,isuse:true},
    })
    var a = 2
    this.getAddress(2)
  },

  clickAddress(e){
    let {start,end} = this.data;
    if((end - start) < 350){
      this.chooseAddress(e)
    }else{
      this.deleteAddress(e)
    }
  } ,

  deleteAddress(e){
    let aid = e.currentTarget.dataset.aid;
    wx.request({
      url: 'http://localhost:8080/address/deleteAddress?aid=' + aid,
      success:()=>{
        this.getAddress()
      }
    })
  },
  start(e){
    this.setData({start:e.timeStamp})
  },
  end(e){
    this.setData({end:e.timeStamp})
  },
 
})