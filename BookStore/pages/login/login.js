// pages/login/index.js
Page({

  handleGetUserInfo(e){
    const {userInfo} = e.detail;
    console.log(e);
    wx.setStorageSync('user', userInfo); 
    this.getOpenid(userInfo)
  },
   
  getOpenid(userInfo){
    var that = this;
    let appid = 'wxcc6ce27574a114ab';
    let secret = '0763394465ae7d401e75af9f1f63cbe0';
    wx.login({
       success: res => {
         console.log(res.code); // 先login得到code
         if (res.code) {
          // 将url中的appid和secret换成自己的  （可以在开发平台查看）
          wx.request({
            url:'https://api.weixin.qq.com/sns/jscode2session',
            data:{
              appid,secret,js_code:res.code,
              grant_type:'authorization_code'
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
            success: function (res) {
               // res.data.openid 即为所求openid
              console.log('openid:' + res.data.openid);
              let openid = res.data.openid;
              wx.setStorageSync('openid', openid);
              let uname = userInfo.nickName;
              let usrc = userInfo.avatarUrl;
              wx.request({
                url: 'http://localhost:8080/user/getUserByOpenid?openid='+openid,
                success:(result)=>{
                  if(result.data === null){     
                    // 添加新用户
                    that.addUser(uname,usrc,openid)
                    // that.getUser(openid)
                  }
                  else{
                    let uid = result.data.uid;
                    wx.setStorageSync('uid', uid);
                    //更新用户
                    that.updateUser(uname,usrc,openid,uid)
                  }         
                    that.getUser(openid)     
                }
              })
             }
           });
         } 
       }
  })

  },
  
  getUser(openid){
    if(!openid){
    }else{ 
      wx.request({
        url: 'http://localhost:8080/user/getUserByOpenid?openid='+openid,
        success:(result)=>{
          wx.setStorageSync('userInfo', result.data)
          console.log("login");
          console.log(result.data);
          wx.navigateBack({
            delta:1,
          })                        
        }
      })
    }
  },

  addUser(uname,usrc,openid){
    wx.request({
      url: 'http://localhost:8080/user/addUser',
      data:{
        uname,usrc,openid
      },
      success:()=>{this.getUser(openid)}
    })
  },
  updateUser(uname,usrc,openid,uid){
    wx.request({
      url: 'http://localhost:8080/user/updateUser',
      data:{
        uname,usrc,openid,uid
      }
    })
  }
  

})


