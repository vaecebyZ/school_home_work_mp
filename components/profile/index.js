// components/profile/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    user: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    logout() {
      wx.showModal({
        cancelColor: '',
        content: '确定退出？',
      }).then(res => {
        if (res.confirm) {
          wx.setStorageSync('token', null);
          wx.reLaunch({
            url: '../login/index',
          });
        }
      })
    }
  },
  lifetimes: {
    ready() {
      const token = wx.getStorageSync('token');
      const user = token?.userInfo;
      this.setData({
        user: user
      })
    },
  }
})