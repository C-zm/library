Page({
  data: {
    swiperList:[]
  },
  getSwiperList(){
    wx.request({
      url: 'http://localhost:8080/swiper/showSwiper',
      success: (result) => {
        console.log(result.data);
        this.setData({
          swiperList:result.data
        })
        
      }
    })
  },
  onLoad: function () {
    this.getSwiperList();
  },



})
