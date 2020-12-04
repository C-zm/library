// pages/paynow/paynow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
    oid:{},
    address:wx.getStorageSync('address')
  },

  onLoad: function (options) {
    const {bid} = options
    this.getBook_detail(bid)
  },
  onShow: function () {
    let address = wx.getStorageSync('address')
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({userInfo,address})
  },

  getBook_detail(bid){
    let that = this
    const {address} = this.data
    wx.request({
      url: 'http://localhost:8080/book/getBookById?bid=' + bid,
      success:(success)=>{
        that.setData({
          book:success.data
        })
        if(!address){
          console.log("no address");
        }else{ that.addOrder(that.data.address.aid,success.data)}
      }
    })
  },
  addOrder(aid,book){
    let uid = wx.getStorageSync("uid")
    let that = this
    wx.request({
      url: 'http://localhost:8080/order/addOrders',
      data:{aid,totalprice:book.bprice,uid},
      success:()=>{
        that.getOid(uid,book)
      }
    })
  },

  getOid(uid,book){
    let that = this
    wx.request({
      url: 'http://localhost:8080/order/getmaxOrders?uid=' + uid,
      success:(res)=>{
        that.setData({oid:res.data})
        that.addOrder_detail(book,res.data)
    }
    })
  },

  addOrder_detail(book,oid){
    const {bname, bsrc, bprice} = book
    wx.request({
      url: 'http://localhost:8080/orderDetail/addOrderDetail',
      data:{oid,bname, bsrc, bprice,num:1}
    })
  },
  updateOrder_detail(){
    const {oid} = this.data
    wx.request({
      url: 'http://localhost:8080/order/updateOrders',
      data:{oid,aid:this.data.address.aid}
    })
    wx.request({
      url: 'http://localhost:8080/orderDetail/updateOrderDetail',
      data:{oid,state:1},
    })
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
    const {pwd,account,uid} = this.data.userInfo;
    const bprice = this.data.book.bprice;
    console.log(account);    
    var b = pwd.toString();
    /**在这调用支付接口**/
    if (pwdVal === b){
      if (bprice <= account){
        wx.request({
          url: 'http://localhost:8080/user/updateUser',
          data:{uid,account:account - bprice},
          success:()=>{    
            wx.request({
              url: 'http://localhost:8080/user/getUserByUid?uid=' + uid,
              success:(res)=>{
                wx.setStorageSync('userInfo', res.data),
                this.updateOrder_detail()
                this.setData({userInfo:res.data})
              }
            })
            wx.showToast({
              title: '支付成功'
            })
            wx.redirectTo({
              url: '/pages/order_detail/order_detail?oid=' + this.data.oid,
            })
          }
        })
      }
      else{
        wx.showToast({
          title: '余额不足，请充值',icon:"none"
        })
      }
    }else{
      wx.showToast({
        title: '支付失败',icon:"none",mask:true
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

})