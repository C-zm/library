
// pages/cart/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
    address:{},
    cart:[],
    checkedCart:[],
    totalPrice:0,
    totalNum:0,
    oid:{},
  },
  onShow(){
    this.setData({userInfo:wx.getStorageSync('userInfo')  })
    this.getPay();
  },

  getPay(){
    // 1 获取缓存中的收货地址信息
    let address = wx.getStorageSync('address');
    //  获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart")||[];
    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      totalPrice += v.num * v.books.bprice;
      totalNum += v.num;
    })
    this.addOrder(address.aid,totalPrice,cart)
    // 5 6 把数据重新设置回data中
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    });

  },

  addOrder(aid,totalprice,cart){
    let uid = wx.getStorageSync("uid")
    let start_date = new Date();
    let that = this
    wx.request({
      url: 'http://localhost:8080/order/addOrders',
      data:{aid,totalprice,uid},
      success:()=>{
        console.log(start_date);
        that.getOid(uid,cart)
        wx.request({
          url: 'url',
        })
      }
    })
  },

  getOid(uid,cart){
    let that = this
    wx.request({
      url: 'http://localhost:8080/order/getmaxOrders?uid=' + uid,
      success:(res)=>{
        that.setData({oid:res.data})
        cart.forEach(v=>{
          that.addOrder_detail(v,res.data)
          that.deleteCart(v.sid)
        })
    }
    })
  },

  addOrder_detail(v,oid){
    const {bname, bsrc, bprice} = v.books
    const {num} = v
    wx.request({
      url: 'http://localhost:8080/orderDetail/addOrderDetail',
      data:{oid:oid,bname, bsrc, bprice,num}
    })
  },
  updateOrder_detail(){
    const {oid} = this.data
    wx.request({
      url: 'http://localhost:8080/orderDetail/updateOrderDetail',
      data:{oid,state:1},
      success:()=>{
        console.log("dcdc");
        
      }
    })
  },

  deleteCart(sid){
    wx.request({
      url:'http://localhost:8080/shoppingcar/deleteShoppingcar?sid=' + sid,
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
    const {totalPrice} = this.data;
    var b = pwd.toString();
    /**在这调用支付接口**/
    if (pwdVal === b){
      if (totalPrice <= account){
        wx.request({
          url: 'http://localhost:8080/user/updateUser',
          data:{uid,account:account - totalPrice},
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