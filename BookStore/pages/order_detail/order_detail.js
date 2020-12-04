// pages/order_detail/order_detail.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {oid} = options;
    let uid = wx.getStorageSync('uid');
    this.getOneOrders_Detail(oid,uid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getOneOrders_Detail(oid,uid){
    wx.request({
      url: 'http://localhost:8080/order/getOneOrders_Detail',
      data:{oid,uid},
      success:(result)=>{
        this.setData({order_detail:result.data})
        this.getaddress(result.data.aid)
        this.ChangeTimeForm(result.data)
      }
    })
  },

  ChangeTimeForm(order_detail){ 
      order_detail.otime = util.formatTime(order_detail.otime,'Y/M/D h:m:s');
      console.log(order_detail.otime);
      
      for(var j = 0; j < order_detail.orderDetail.length; j++){
        if(order_detail.orderDetail[j].state === 0){
          order_detail.orderDetail[j].state = "待付款";
        }
        else if(order_detail.orderDetail[j].state === 1){
          order_detail.orderDetail[j].state = "待取书";
        }
        else if(order_detail.orderDetail[j].state === 2){
          order_detail.orderDetail[j].state = "待还书";
        }
        else if(order_detail.orderDetail[j].state === 3){
          order_detail.orderDetail[j].state = "已还书";
        }
        else{
          order_detail.orderDetail[j].state = "逾期未还";
        }
      }
      this.setData({order_detail})
     
  },

  getaddress(aid){
    console.log(aid);
    wx.request({
      url: 'http://localhost:8080/address/getAddressByAid?aid=' + aid,
      success:(result)=>{
        this.setData({address:result.data})
      }
    })
  },
 
})