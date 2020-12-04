Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 1 获取缓存中的收货地址信息
    let address = wx.getStorageSync('address');
    console.log(address);
    
    this.handleChooseAddress();
    this.getCart();
    this.setData({address})
    const {cart} = this.data
    this.setCart(cart)
  },

  // 点击收货地址
  handleChooseAddress(){
    let uid = wx.getStorageSync('uid');
    if(!uid){
      wx.showToast({
        title: '请先登录',
        icon:"loading",
        mask:true,
        duration1:1000
      })
    }else{
   
  }

  },

  handleItemChange(e){
    // 1 获取被修改的商品的id
    const bid = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品
    let index = cart.findIndex(v=>v.bid === bid);
    // 4 选中状态取反
    wx.request({
      url: 'http://localhost:8080/shoppingcar/updateShoppingcar',
      data:{
        sid: cart[index].sid,
        checked: !cart[index].checked
      },
      success:()=>{
        this.getCart();        
      }
    })
    // cart[index].checked=!cart[index].checked;
    // this.setCart(cart);
  },

  getCart(){
    const uid = wx.getStorageSync('uid');
    if(!uid){
      wx.showToast({
        title: '请先登录',
        icon:"loading",
        mask:true,
        duration1:1000
      })
    }else{
      wx.request({
        url: 'http://localhost:8080/shoppingcar/getAllbookShoppingcar?uid=' + uid,
        success:(result)=>{
          this.setData({
            cart:result.data
          })
          console.log(result.data);
          
          wx.setStorageSync('cart', result.data)
          this.setCart(result.data)
        }
      })
    }
  },

  setCart(cart){
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num * v.books.bprice;
        totalNum += v.num;
      }
      else{
        allChecked = false; 
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;    
    // 5 6 把数据重新设置回data中和缓存
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
  },

  // 全选和反选
  handleItemAllChange(){
    let {cart, allChecked} = this.data;
    allChecked = !allChecked;
    
    cart.forEach(v=>{
      console.log(v);
      wx.request({
        url: 'http://localhost:8080/shoppingcar/updateShoppingcar',
        data:{
          sid:v.sid,
          checked:allChecked
        },success:()=>{this.getCart()}
      })
      });
    this.setCart(cart)

  },

  // 商品数量编辑功能
  handleItemNumEdit(e){
    // 1 获取传递过来的参数
    const {operation, id} = e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart} = this.data;
    // 3 找到需要修改的商品的索引
    const index =  cart.findIndex(v=>v.bid === id);

    // 进行判断
    if(cart[index].num === 1 && operation === -1){
      // 弹窗提示
      wx.showModal({
        title: '提示',
        content: '您是否要删除该商品',
        success: (res) =>{
          if (res.confirm) {
            let sid = cart[index].sid;
            cart.splice(index,1);
            this.setCart(cart);
            wx.request({
              url: 'http://localhost:8080/shoppingcar/deleteShoppingcar?sid=' + sid,
            })
          } else if (res.cancel) {
          }
        }
      })
    }else{
      // 4 进行修改数据
      cart[index].num+=operation;
      // 设置会回缓存和data中
      this.setCart(cart);
      console.log(cart[index]);
      const {bid,num,sid} = cart[index]
      wx.request({
        url: 'http://localhost:8080/shoppingcar/updateShoppingcar',
        data:{bid,num,sid}
      })
    }
  },
  
  // 点击结算
  handlePay(){
    // 1 判断是否有地址
    const {address,totalNum} = this.data;
    if(!address){
      wx.showToast({
        title: '您还没有选择收货地址',
        icon:"none"
      })
      return;
    }
    if(totalNum === 0){
      wx.showToast({
        title:"您还没有选购商品",
        icon:"none"
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  },

})