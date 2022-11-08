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
    isLoading: false,
    page: 0,
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
    titleInput(event) {
      this.setData({
        pTitle: event.detail.value
      })
    },
    upPost(e) {
      wx.showLoading({
        title: '加载中...',
      })
      console.log(e.currentTarget.dataset)
      // const _this = this
      wx.request({
        url: `${app.globalData.baseUrl}/playground/up`,
        method: "POST",
        data: {
          pId: e.currentTarget.dataset.pid,
          ups: e.currentTarget.dataset.ups
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
              this.initData()
            },
          })
        }
      })
    },
    onClose() {
      wx.showLoading({
        title: '加载中...',
      })
      console.log(this.data)
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
              this.initData()
            },
          })
        }
      })
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
      })
    },
    pullDownRefresh() {
      console.log('下拉刷新....');
      this.setData({
        isLoading: true,
        page: 0
      })
      this.initData()
    },
    loadMore() {
      this.setData({
        page: this.data.page += 1
      })
      this.initData()
      console.log('加载更多....')
    },
    contentInput(event) {
      this.setData({
        pContent: event.detail.value
      })
    },
    initData() {
      wx.showLoading({
        title: '加载中...',
      })

      const _this = this
      wx.request({
        url: `${app.globalData.baseUrl}/playground`,
        method: "GET",
        data: {
          page: this.data.page
        },
        success: (res) => {
          console.log(res)
          if (res.data.playgroundList.length == 0 && this.data.page != 0) {
            wx.showToast({
              title: '没有更多了！',
              icon: 'error'
            })
            this.setData({
              page: this.data.page -= 1,
              pContent: '',
              pTitle: ''
            })
          } else {
            if (this.data.page > 0) {
              _this.setData({
                postList: _this.data.postList.concat(res.data.playgroundList),
                pContent: '',
                pTitle: ''
              })
            } else {
              _this.setData({
                postList: res.data.playgroundList,
                pContent: '',
                pTitle: ''
              })
            }

          }

          wx.hideLoading({
            success: (res) => {
              setTimeout(() => {
                this.setData({
                  isLoading: false
                })
              }, 1000)
            },
          })
        }
      })
    },
    toDetail(e){
      app.globalData.postId = e.currentTarget.dataset.item.pId;

      wx.navigateTo({
        url: '../detail/index',
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