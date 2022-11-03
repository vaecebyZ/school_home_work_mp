// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    active: 0,
  },
  onChange(event) {
    wx.showLoading({
      title: '加载中。。。'
    })
    setTimeout(() => {
      this.setData({
        active: event.detail
      });
      wx.hideLoading({})
    }, 500)

  },
  onLoad() {
    // 第一次登陆判断
    const isFirstIn = wx.getStorageSync('isFirstIn') || null
    if (!isFirstIn) {
      wx.setStorageSync('isFirstIn', 1);
      wx.navigateTo({
        url: '../welcome/index',
      })
    }
  },
  onShow() {
    const token = wx.getStorageSync('token')
    // 登陆判断
    if (token) {

    } else {
      wx.navigateTo({
        url: '../login/index',
      })
    }
  },

})