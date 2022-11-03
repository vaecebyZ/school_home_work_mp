// pages/settings/page/reset_name/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldName: '',
    newName: '',
    id: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const user = wx.getStorageSync('token').userInfo
    this.setData({
      oldName: user.uName,
      newName: user.uName,
      id: user.uId
    })
  },
  onChange(e) {

    this.setData({
      newName: e.detail
    })
  },
  submit() {
    const _this = this

    console.log(this.data.newName, this.data.oldName)

    if ((this.data.newName !== this.data.oldName) && this.data.newName) {

      wx.showModal({
        content: '确认修改？'
      }).then(res => {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: `${app.globalData.baseUrl}/user/setusername`,
            method: 'POST',
            data: {
              uName: _this.data.newName,
              uId: _this.data.id,
              oldUName: _this.data.oldName
            },
            success: (res) => {
              wx.hideLoading()
              wx.showToast({
                title: '修改成功！',
                icon: 'none'
              })
              setTimeout(() => {
                const token = wx.getStorageSync('token');
                token.userInfo.uName = _this.data.newName;
                wx.setStorageSync('token', token);
                wx.redirectTo({
                  url: '../../index',
                })
              }, 500)
            }
          })
        }
      })

    } else {

      wx.showToast({
        title: '请做出修改！',
        icon: 'none'
      })

    }
  }
})