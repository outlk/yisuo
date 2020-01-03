//index.js
//获取应用实例
const app = getApp()
var fableData = require('../../data/yisuodata.js')
var fableList = fableData.fableList
shuffle(fableList)
removeInvalidFables(fableList)

var startX, endX, startY, endY;
var moveFlag = true;// 判断执行滑动事件

Page({
  data: {
    swiperHeight: 1500,
    hidetip: false,
    buffer: fableList,
    card: 1,
    page: 0,
    ani1: '',
    ani2: ''
  },

  // onPullDownRefresh: function () {
  //   wx.stopPullDownRefresh()
  // },

  onLoad: function () {
    var that = this
    setTimeout(function(){
      that.setData({
        hidetip: true
      })
    }, 1500)
  },

  //回到顶部
  goTop: function (e) { // 一键回到顶部
     if (wx.pageScrollTo) {
        wx.pageScrollTo({
           scrollTop: 0,
           duration:0
        })
     } else {
        wx.showModal({
           title: '提示',
           content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
     }
  },

  touchStart: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的原点
    startY = e.touches[0].pageY;
    moveFlag = true;
  },

  // 触摸移动事件

  touchMove: function (e) {
    endX = e.touches[0].pageX; // 获取触摸时的原点
    endY = e.touches[0].pageY;
    var yGap = Math.abs(endY - startY);
    var xGap = 20;
    console.log(yGap);

    if (moveFlag) {
      if (endX - startX > xGap && yGap < xGap) {
        console.log("move right");
        this.move2right();
        moveFlag = false;
      }
      if (startX - endX > xGap && yGap < xGap) {
        console.log("move left");
        this.move2left();
        moveFlag = false;
      }
    }
  },

  // 触摸结束事件
  touchEnd: function (e) {
    moveFlag = true; // 回复滑动事件
  },

  moveNext(start, end, addPage) {
    var that = this;

    var nextCard = 2 - (this.data.card + 1) % 2;
    var nextPage = this.data.page + addPage;
    if (nextPage < 0) {
      return
    }
    
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 100
    });
    animation.opacity(0.2).translate(start, end).step()

    if (nextCard == 2) {
      this.setData({
        ani1: animation.export()
      })
      setTimeout(function () {
        that.setData({
          card: nextCard,
          ani2: '',
          page: nextPage
        });
      }, 400)
    } else {
      this.setData({
        ani2: animation.export()
      })
      setTimeout(function () {
        that.setData({
          card: nextCard,
          ani1: '',
          page: nextPage
        });
      }, 400)
    }

    setTimeout(function(){
      that.goTop()
    },410)
  },

  //向左滑动操作
  move2left() {
    this.moveNext(-500, 0, 1)
  },

  //向右滑动操作
  move2right() {
    this.moveNext(500, 0, -1)
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

function updateWrapperHeight(that, index) {
  //创建节点选择器
  var query = wx.createSelectorQuery();
  //选择id
  query.selectAll('.wrapper').boundingClientRect()
  var height;
  query.exec(function (res) {
    console.log(res);
    height = res[0][index].height + 30;
    console.log(height)
    that.setData({
      swiperHeight: height
    })
  })
  return height;
}

function shuffle(arr) {
  var m = arr.length;
  while (m) {
    var i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};

function removeInvalidFables(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    var content = arr[i].content;
    if (content == null || content.length == 0) {
      console.log('remove ' + arr[i].title);
      arr.splice(i, 1);
    }
  }
}