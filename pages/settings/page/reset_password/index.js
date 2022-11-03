// pages/settings/page/reset_password/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPwd: '',
    newPwd: '',
    confirmPwd: ''
  },
  setOldPwd(e) {
    this.setData({
      oldPwd: e.detail
    })
  },
  setNewPwd(e) {
    this.setData({
      newPwd: e.detail
    })
  },
  setConfirmPwd(e) {
    this.setData({
      confirmPwd: e.detail
    })
  },
  submit() {
    const _this = this;
    if (_this.data.oldPwd && _this.data.newPwd && _this.data.confirmPwd) {
      if (_this.data.newPwd === _this.data.confirmPwd) {
        // 修改
        wx.showLoading({})
        const id = wx.getStorageSync('token').userInfo.uId;
        wx.request({
          url: `${app.globalData.baseUrl}/user/setuserpwd`,
          method: "POST",
          data: {
            uPassword: _this.data.newPwd,
            uOldPassword: _this.data.oldPwd,
            uId: id,
          },
          success: (res) => {
            wx.hideLoading();
            if (res.data.success) {
              wx.showToast({
                title: '修改成功！',
                icon: 'none'
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '../../index',
                })
              }, 500)
            }else{
              wx.showToast({
                title: '密码错误！',
                icon: 'none'
              })
            }

          }
        })



      } else {

        wx.showToast({
          title: '两次密码不一致！',
          icon: 'none'
        })

      }
    } else {
      wx.showToast({
        title: '不能为空！',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
})