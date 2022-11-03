// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    form: {
      username: '',
      password: '',
      confirm: ''
    },
    isLogin: true
  },
  changeType() {
    const _this = this;
    wx.showLoading();
    setTimeout(() => {
      _this.setData({
        isLogin: !_this.data.isLogin
      })
      wx.hideLoading()
    }, 500)
  },
  register() {
    const _this = this
    if (this.data.form.username && this.data.form.password) {
      wx.showLoading();
      wx.request({
        url: `${app.globalData.baseUrl}/user/register`,
        method: 'POST',
        data: _this.data.form,
        success: (res) => {
          console.log(res);
          if (res.statusCode == 200) {
            wx.showToast({
              title: '注册成功！',
              icon: 'success'
            })
          }
          _this.setData({
            isLogin: true
          })
          wx.hideLoading();
        }
      })


    } else {
      wx.showToast({
        title: '请输入账户与密码！',
        icon: 'none'
      })
    }
  },
  goLogin() {
    if (this.data.form.username && this.data.form.password) {
      wx.showLoading()
      const _this = this
      wx.request({
        url: `${app.globalData.baseUrl}/user/login`,
        method: 'POST',
        data: _this.data.form,
        success: (res) => {
          if (res.statusCode == 200) {

            wx.showToast({
              title: '登陆成功！',
              icon: 'success'
            })

            // 凭证储存
            wx.setStorageSync('token', res.data);
            // 进入首页
            wx.redirectTo({
              url: '../index/index',
            })
          } else {
            wx.showToast({
              title: '账户或者密码错误!',
              icon: 'error'
            })
          }
          wx.hideLoading();
        },
        fail: (res) => {
          wx.hideLoading();
          wx.showToast({
            title: '网络错误！',
            icon: 'error'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入账号和密码!',
        icon: 'none'
      })

    }


  },
  setPassword(e) {
    this.setData({
      'form.password': e.detail.value
    })
  },
  setConfirm(e) {
    this.setData({
      'form.confirm': e.detail.value
    })
  },
  setUsername(e) {
    this.setData({
      'form.username': e.detail.value
    })
  },
  onLoad() {
    console.log('登陆页面加载！')
  },
  onShow() {
     // 判断是否登陆过
     const token = wx.getStorageSync('token')
     console.log('登录页判断',token)
     if (token) {
       wx.redirectTo({
         url: '../index/index',
       })
     }else{
      wx.showToast({
        title: '请登陆!',
        icon: 'none',
        duration: 2000 //持续的时间
      })
     }

  }
})