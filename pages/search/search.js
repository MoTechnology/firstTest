// pages/search/search.j

var network_util = require('../../utils/network.js');

const app = getApp();
var location;
var isOpenSetting = false;
var longi;
var lat;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  text:"",
  sentext:"",
  checkword:null,
  location: '上海市',
  hasRefresh: false,
  nowTemperature: '0 ℃',
  nowWind: '晴/东北风  微风',
  nowAir: '50  优'
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
Weather: function (lat, longi) {
  var _this = this;
  //数据集合
  var url = "https://free-api.heweather.com/s6/weather";
  var airUrl = "https://free-api.heweather.com/s6/air";
  var data = {
    key: "bff5cc9bcfdf46b0a0e9bf0c260ff14f",
    location: location ? longi + "," + lat : "shanghai",
    lang: "zh",
    unit: "m"
  };
  network_util._get(url, data, function (res) {
    // console.log(res.data.HeWeather6[0])
    var now = res.data.HeWeather6[0].now;
    var hourly = res.data.HeWeather6[0].hourly;
    var daily = res.data.HeWeather6[0].daily_forecast;
    _this.setData({
      nowBackGround: [now.cond_code, now.tmp],
      nowTemperature: now.tmp + "℃",
      nowWind: now.cond_txt + "/" + now.wind_dir + "   " + now.wind_sc,
      hourlyArr: hourly,
      dailyForecast: daily,
    })
  }, function (res) {

  }, function () {
    // 数据成功后，停止下拉刷新
    wx.stopPullDownRefresh();
    wx.hideLoading()
  });
  //空气质量请求
  network_util._get(airUrl, data, function (res) {
    // console.log(res.data)
    var nowAirCity = res.data.HeWeather6[0].air_now_city;
    _this.setData({
      nowAir: nowAirCity.aqi + "  " + nowAirCity.qlty,
    })
  }, function (res) {

  }, function () {

  });
},
getLocationAction: function () {
  // var location;
  var _this = this;
  wx.getLocation({
    success: function (res) {
      lat = res.latitude
      longi = res.longitude
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      _this.genCodeLocation(lat, longi)
    },
    fail: function () {
      _this.Weather("", "");
    }
  })
},
refresh: function () {
  this.setData({
    hasRefresh: true
  })

},
onPullDownRefresh: function () {
  this.Weather(longi, lat);
},
genCodeLocation: function (lat, longi) {
  var _this = this;
  var url = "https://restapi.amap.com/v3/geocode/regeo";
  var data = {
    key: "05e62c98ebc533cb8811ae71ca817033",
    location: longi + "," + lat
  }
  network_util._get(url, data, function (res) {
    // console.log(res.data)
    _this.setData({
      location: res.data.regeocode.addressComponent.district + res.data.regeocode.addressComponent.township
    })
  }, function (res) {

  }, function () {
    location = "youzhi"
    _this.Weather(lat, longi)
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocationAction()
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
  
  },
  chooseLocation: function () {
    var isopenLoction;
    var _this = this;
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        isopenLoction = res.authSetting["scope.userLocation"]
        // console.log(isopenLoction)
        if (isopenLoction) {
          wx.chooseLocation({
            success: function (res) {
              // console.log(res)
              _this.setData({
                location: res.address,
              })
              longi = res.longitude
              lat = res.latitude
              location = res.latitude + ":" + res.longitude
              _this.Weather(res.latitude, res.longitude)
            },
          })
        } else {
          wx.showToast({
            title: '检测到您没获得位置权限，请先开启哦',
            icon: "none",
            duration: 3000
          })
          setTimeout(function () {
            //打开设置
            wx.openSetting({
              success: (res) => {
                // console.log(res)
                isOpenSetting = res.authSetting["scope.userLocation"]
                _this.getLocationAction()
              }
            })
          }, 3000)
        }
      }
    })
  },
})