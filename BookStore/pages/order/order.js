// pages/order/order.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:"全部订单",
        isActive:true
      },
      {
        id:1,
        name:"待付款",
        isActive:false
      },
      {
        id:2,
        name:"待收货",
        isActive:false
      },
      {
        id:3,
        name:"退货/换货",
        isActive:false
      }
    ],
  },
      // 标题点击事件  从子组件传来
      handelTabsItemChange(e){
        // 1 h获得被点击的标题索引
        const {index} = e.detail;
        // 2 修改原数组
        let {tabs} = this.data;
        tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
        this.setData({
          tabs
        })
      },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {uid} = options
    this.getOrder(uid) 
    var sjc = 1593766239000;
    console.log(util.formatTime(sjc,'Y/M/D h:m:s'));
    console.log(util.formatTime(sjc, 'h:m'));
  },
  getOrder(uid){
    if(!uid){
      wx.showToast({
        title: '请登录',
        icon:"none",
        duration:1000
      })
    }
    else{
      wx.request({
        url: 'http://localhost:8080/order/getAllOrders_Detail?uid=' + uid,
        success:(success)=>{
          this.ChangeTimeForm(success.data)
          this.setData({orderList:success.data})
        }
      })
    }
  },
  ChangeTimeForm(orderList){
    for(var i = 0; i < orderList.length; i++){
      orderList[i].otime = util.formatTime(orderList[i].otime,'Y/M/D h:m:s');
      for(var j = 0; j < orderList[i].orderDetail.length; j++){
        if(orderList[i].orderDetail[j].state === 0){
          orderList[i].orderDetail[j].state = "待付款";
        }
        else if(orderList[i].orderDetail[j].state === 1){
          orderList[i].orderDetail[j].state = "待取书";
        }
        else if(orderList[i].orderDetail[j].state === 2){
          orderList[i].orderDetail[j].state = "待还书";
        }
        else if(orderList[i].orderDetail[j].state === 3){
          orderList[i].orderDetail[j].state = "已还书";
        }
        else{
          orderList[i].orderDetail[j].state = "逾期未还";
        }
      }
      this.setData({orderList})
    }
  }
   
  
})