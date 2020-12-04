Page({
  data: {
    book_detail:{},
    // 商品是否被收藏
    isCollect:false,
    colid:0
  },

  onLoad: function (options) {
    const {bid} = options
    this.getBook_Detail(bid);
    this.getComment(bid)
    this.getCollect(bid);
  },
  
  getBook_Detail(bid){
    wx.request({
      url: 'http://localhost:8080/bookDetail/getBookDetailById?bdid=' + bid,
      success:(success)=>{
        this.getSrcList(success.data)
        this.setData({
          book_detail:success.data
        })
      }
    })
  },

  getSrcList(book){
    const {bsrclist,introduce} = book
    var citys = bsrclist.split(",");
    var intro = introduce.split('● ');
    this.setData({bsrclist:citys,introduce:intro})
  },

  // 点击图片放大预览
  handlePrevewImage(e){
    // 1 构造要预览的图片数组
    const urls=this.data.bsrclist;
    // 2 接收传递过来的图片的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    })
  },

  getCollect(bid){
    let uid = wx.getStorageSync('uid');
    wx.request({
      url: 'http://localhost:8080/collect/getCollectByUidBid?uid=' + uid  + '&bid=' + bid,
      success:(result)=>{
        if(result.data.length !== 0){
          this.setData({
            isCollect:true,
            colid:result.data[0].colid
          })
        }
      }
    })
      
  },
    // 点击收藏事件
  handleCollect(){    
    const {bid} = this.data.book_detail;
    let uid = wx.getStorageSync('uid');
    const {isCollect} = this.data
    if(!uid){
      wx.showToast({
        title: '请先登录',
        icon:"loading",
        mask:true,
        duration1:1000
      })
    }else{
      // 2 判断该商品是否被收藏过
      if(isCollect){        
        const {colid} = this.data;
        wx.request({
          url: 'http://localhost:8080/collect/deleteCollect?colid=' + colid,
          success:(result)=>{
            this.setData({
              isCollect:false
            })
          }
        })
        wx.showToast({
              title: '取消成功',
              icon:'success',
              mask:true
            });
      }
      else{
        wx.request({
          url: 'http://localhost:8080/collect/addCollect?uid=' + uid  + '&bid=' + bid,
          success:()=>{
            this.getCollect(bid)
          }
        })
        wx.showToast({
          title: '收藏成功',
          icon:'success',
          mask:true
        });
      }
    }
  },

  // 1 点击购物车触发事件
  handleCartAdd(){
    let uid = wx.getStorageSync('uid');
    let bid = this.data.book_detail.bid;
    if(!uid){
      wx.showToast({
        title: '请先登录',
        icon:"loading",
        mask:true,
        duration1:1000
      })
    }else{
      wx.request({
        url: 'http://localhost:8080/shoppingcar/getShoppingcarByUid?uid=' + uid,
        success:(result)=>{
          let shoppingcar = result.data;
          // 先判断  当前商品是否存在于购物车中
          let index = shoppingcar.findIndex(v=>v.bid === bid)
          if(index === -1){
            // 若不存在  直接给购物车数组添加一个新元素 新元素带上购买数量属性
            wx.request({
              url: 'http://localhost:8080/shoppingcar/addShoppingcar',
              data:{
                bid,
                uid,
                num:1
              }
            })
          }
          else{
            wx.request({
              url: 'http://localhost:8080/shoppingcar/updateShoppingcar',
              data:{
                sid: shoppingcar[index].sid,
                num:shoppingcar[index].num+1
              }
            })
          }
          // 弹出提示
          wx.showToast({
            title: '加入成功',
            icon:'success',
            // true 防止用户疯狂点击
            mask:true
          })
          
        }
      })
    }
  },

  getComment(bid){
    wx.request({
      url: 'http://localhost:8080/comment/getCommentByBid?bid=' + bid,
      success:(res)=>{
        let comment = res.data
        this.getUser(comment)
        this.setData({comment})
      }
    })
  },
  getUser(comment){
    if(comment.length !==0){
      comment.forEach(v => {
        if(v.uid){
          wx.request({
            url: 'http://localhost:8080/user/getUserByUid?uid=' + v.uid,
            success:(res)=>{
              v.userInfo = res.data
              this.setData({comment})
            }
          })
        }
        if(v.csrc){
          var src = v.csrc.split(",");
          v.csrc = src
          this.setData({comment})          
        }
      });
    }
  },
  // 评论图片变大
  getBigPhoto(e){
    let urls = e.currentTarget.dataset.csrc;
    let current = e.currentTarget.dataset.src;
    wx.previewImage({
      current,
      urls,
    })
  }
})
