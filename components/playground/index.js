// components/playground/index.js
const app = getApp()
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
    isActive: false,
    user: null,
    isFocus: false,
    postList: [],
    pContent: '',
    pTitle: '测试标题'

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickBall() {
      this.setData({
        isActive: !this.data.isActive
      })
    },
    onClose() {
      wx.showLoading({
        title: '加载中...',
      })
      console.log(this.data)
      // setTimeout(()=>{
      const _this = this
      wx.request({
        url: `${app.globalData.baseUrl}/playground/post`,
        method: "POST",
        data: {
          uId: _this.data.user.uId,
          pContent: _this.data.pContent,
          pTitle: _this.data.pTitle
        },
        success: () => {
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '成功',
              })
              this.setData({
                isActive: false
              })
            },
          })
        }
      })

      // },1000)
    },
    setFocusName() {
      this.setData({
        isFocus: true
      })
    },
    removeFocusName(e) {
      console.log(e)
      this.setData({
        isFocus: false,
        pContent: e.detail.value
      })
    },
    pullDownRefresh() {
      console.log('下拉刷新....')
    },
    loadMore() {
      console.log('加载更多....')
    },
    initData() {
      wx.showLoading({
        title: '加载中...',
      })

      // setTimeout(()=>{
      const _this = this
      wx.request({
        url: `${app.globalData.baseUrl}/playground`,
        method: "GET",

        success: (res) => {
          console.log(res)
          _this.setData({
            postList: res.data.playgroundList
          })
          wx.hideLoading({
            success: (res) => {


            },
          })
        }
      })
    }
  },
  lifetimes: {
    ready() {
      // 获取用户缓存
      const token = wx.getStorageSync('token');
      this.setData({
        user: token.userInfo
      })
      this.initData()
    },
  },
})