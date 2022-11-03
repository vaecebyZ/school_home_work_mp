// components/playground/index.js
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
    isActive:false,
    user:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickBall(){
      this.setData({
        isActive:!this.data.isActive
      })
    },
    onClose(){
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(()=>{
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '成功',
            })
            this.setData({
              isActive:false
            })
          },
        })
      },1000)
    }
  },
  lifetimes: {
    ready() {
      // 获取用户缓存
      const token = wx.getStorageSync('token');
      this.setData({
        user: token.userInfo
      })
    },
  },
})
