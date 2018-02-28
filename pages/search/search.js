// pages/search/search.j
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  text:"",
  sentext:"",
  checkword:null
  },
  wordInput:function(e){
    console.log(e);
    this.setData({checkword:e.detail.value});
  },
btnClick:function(){
  var thispage=this;
  app.getInfo(this.data.checkword,function(data){
    if(data.data.cn_definition){
      thispage.setData({text:data.data.cn_definition.defn});
      app.getSen(data.data.id,function(data){
        var sen=(data.data)[0].annotation;
        sen=sen.replace(/<[^>]+>/g,"");
        var tran=(data.data)[0].translation;
        var showText="例句:"+"\n"+sen+"\n"+tran;
        thispage.setData({sentext:showText});
      })
    }else{
      thispage.setData({tex:"查不到"});
      thispage.setData({sentext:""});
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})