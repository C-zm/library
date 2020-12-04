Page({
  
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
    tabs:[
      {
        id:0,
        name:"综合",
        isActive:true
      },
      {
        id:1,
        name:"销量",
        isActive:false
      },
      {
        id:2,
        name:"价格",
        isActive:false
      }
    ],
  },
  // 接口的返回数据
  Cates: [],  
  onLoad: function (options) {
    const Cates = wx.getStorageSync('cates');
    // 2 判断
    if(!Cates){
      // 若不存在  发送请求获取数据
      this.getCates();
    }
    else{
      // 可以使用旧数据   先定义一个时间戳
      if(Date.now() - Cates.time > 1000*100){
         this.getCates();
      }
      else{
        this.Cates;
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });  
      }

    }
  },
  // 左侧菜单点击事件 
  handleItemTap(e){
    const {index} =e.currentTarget.dataset; 
    let rightContent = this.Cates[index].books;
    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置右侧距离
      scrollTop:0
    })
  },
  // 获取分类页面信息
  getCates(){ 
    const result = wx.request({
      url: 'http://localhost:8080/classification/getAllbooktype',
      success:(result)=>{
        this.Cates = result.data;
        console.log(this.Cates);
        
        // 构造左侧商品菜单数组
         let leftMenuList = this.Cates.map(v=>v.btype);
        // 构造右侧商品数据
        let rightContent = this.Cates[0].books;
        console.log(rightContent);
        
        this.setData({
          leftMenuList,
          rightContent,
        })
      }
    })
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
    }
  
})