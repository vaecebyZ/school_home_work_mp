// pages/detail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log();
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/playground/detail`,
      method: 'GET',
      data: {
        pId: app.globalData.postId
      },
      success: ({
        data
      }) => {
        console.log(data);
        wx.hideLoading()
      }
    })

  },


})