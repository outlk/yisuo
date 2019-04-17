//index.js
//获取应用实例
const app = getApp()
var fableData = require('../../data/yisuodata.js')
var fableList = fableData.fableList

Page({
  data: {
    fable: getOneRandomFable(),
    hidetip: false
  },

  onPullDownRefresh: function () {
    this.setData({
      fable: getOneRandomFable()
    })
    wx.stopPullDownRefresh()
  },

  onLoad: function () {
    var that = this
    setTimeout(function(){
      that.setData({
        hidetip: true
      })
    }, 1500)
  }
})

function isValidFable(fable) {
  return fable['content'].length > 0
}

function getOneRandomFable() {
  var length = fableList.length;
  var index = parseInt(Math.random() * length)
  while (!isValidFable(fableList[index])) {
    index = parseInt(Math.random() * length)
  }
  return fableList[index];
}