// pages/detail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: null,
    comment: '',
    user: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取用户缓存
    const token = wx.getStorageSync('token');
    this.setData({
      user: token.userInfo
    })
    this.init()

  },
  init() {
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
        this.setData({
          post: data.playgroundDetail
        })
        wx.hideLoading()
      }
    })
  },
  startTouched() {
    // console.log('触摸hajime')
    this.setData({
      clicked: true
    })

    if (this.data.comment) {
      wx.request({
        url: `${app.globalData.baseUrl}/playground/comment`,
        method: "POST",
        data: {
          comment: this.data.comment,
          pId: this.data.post.pId,
          uId: this.data.user.uId,
        },
        success: ({
          data
        }) => {
          if (data.success) {
            wx.showToast({
              title: '评论成功了😲',
              icon: "success"
            })
            this.setData({
              comment: ''
            })
            this.init()
            // this.getCommentByVideo()
          } else {
            wx.showToast({
              title: '出了一点问题.',
              icon: "error"
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请输入内容！',
        icon: 'none'
      })
    }
  },

  endTouched() {
    // console.log('触摸owari')
    this.setData({
      clicked: false
    });
  },
  getComment(e) {
    this.setData({
      comment: e.detail.value
    })
  },
})