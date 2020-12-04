/**
 * 
  1 点击 “+” 触发tap事件
    1 调用小程序内置的 选择图片的api
    2 获取到图片的路径  保存到数组
    3 把图片路径 存在data 的变量中
    4 页面可以根据 图片数组 进行循环显示 自定义组件 
  2 点击自定义图片 组件
    1 获取被点击的元素的索引
    2 获取data中的图片数组
    3 根据索引 数组中删除对应的元素
    4 把数组重新设置回data中
  3 点击“提交”
    1 获取文本域的内容
      1 data中定义变量 表示输入框内容
      2 文本域绑定输入事件 事件触发的时候 把输入框的值 存入到变量中
    2 对这些内容 合法性验证
    3 验证通过 用户选择的图片 上传到专门的图片服务器 返回图片外网链接
      1 遍历图片数组
      2 挨个上传
      3 自己再维护数组 存放图片上传后的外网连接
    4 文本域 和 外网的图片链接 一起提交到服务器
    5 清空当前页面
    6 返回上一页
*/
Page({

  data: {
    tabs:[
      {
        id:0,
        name:"体验问题",
        isActive:true
      },
      {
        id:1,
        name:"商品、商家投诉",
        isActive:false
      }
    ],
    // 被选中的图片路径 数组
    chooseImage:[],
    // 文本域的内容
    textVal:""
  },
  // 外网的图片的路径数组
  UpLoadImgs:[],
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
  // 点击“+” 选择图片事件
  handleChooseImg(){
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片的格式  原图  压缩
      sizeType: ['original','compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album','camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImage:[...this.data.chooseImage,...result.tempFilePaths]
        })    
      }
    })
  },
  // 点击自定义组件删除图片
  handleRemoveImg(e){
    const {index} = e.currentTarget.dataset;
    let {chooseImage} = this.data;
    chooseImage.splice(index,1);
    this.setData({
      chooseImage
    }) 
  },
  // 文本域的输入事件 
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //  提交按钮 
  handleFormSubmit(){
    // 获取文本域的内容
    const {textVal, chooseImage} = this.data;
    // 合法性检验
    if(!textVal.trim()){
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon:"none",
        mask:true
      });
      return;
    };
    // 准备上传图片 到专门的图片服务器
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组  挨个上传
    
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
  });

     //判断是否存在图片
     if (chooseImage.length != 0) {
      //循化上次图片
      chooseImage.forEach((v, i) => {
              wx.uploadFile({
                  filePath: v,
                  name: 'file',
                  url: 'https://imgchr.com/i/MjaXxU',
                  success: (res) => {
                      // console.log(res);
                      let url = res.cookies[0];
                      // console.log(url);
                      //将成功上传到服务器到地址返回存储
                      this.UpLoadImgs.push(url);
                      console.log(this.UpLoadImgs);
                      //判断是否为最后一张图片
                      if (i === chooseImage.length - 1) {
                          wx.hideLoading();
                          console.log("把文本的内容和外网的图片数组 提交到后台中");
                          this.setData({
                              textVal: "",
                              chooseImage: []
                          });
                          // 返回上一个页面
                          // wx.navigateBack({
                          //     delta: 1
                          // });
                      }
                  },
                  fail: (err) => {}
              })
          })
          wx.hideLoading();
          console.log("只是提交了文本");
          // wx.navigateBack({
          //     delta: 1
          // });
    }
    else {
      wx.hideLoading();
      console.log("只是提交了文本");
      // wx.navigateBack({
      //     delta: 1
      // });
  }

    
    // chooseImage.forEach((v,i)=>{
    //   wx.uploadFile({
    //     // 被上传的文件的路径
    //     filePath: v,
    //     // 上传文件的名称 用于后台获取文件
    //     name: 'file',
    //     // 图片要上传到哪里 
    //     url: 'https://imgchr.com/i/MjaXxU',
    //     // 顺带的文本信息
    //     formData:{},
        
    //     success: (result) => {
    //       console.log(result);  
    //       // let url = JSON.parse(result.data);
    //       // this.UpLoadImgs.push(url);
    //       let url = JSON.parse(result.data).url;
    //       this.UpLoadImgs.push(url);
    //       // console.log(this.UpLoadImgs);

    //     }
    //   })  
    // })
  }
 
})














