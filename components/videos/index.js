// components/videos/index.js
const app = getApp()
Component({
  data: {
    videoList: [],
    playing: {
      url: '',
      id: '',
      name: '',
      collectionList: [],
      upList: [],
    },
    user: null,
    timer: null,
    clicked: false,
    comment: '',
    commentList: []
  },
  lifetimes: {
    ready() {
      // const token = wx.getStorageSync('token');
      // const user = token?.userInfo;
      // this.setData({
      //   user: user
      // })

      // 获取用户缓存
      const token = wx.getStorageSync('token');
      this.setData({
        user: token.userInfo
      })
      this.init()
    },
  },
  methods: {
    init() {
      wx.request({
        url: `${app.globalData.baseUrl}/home`,
        method: 'GET',
        success: (res) => {

          const list = res.data.videoList;
          this.setData({
            videoList: list,
            playing: {
              id: list[0].vId,
              name: list[0].vName,
              src: list[0].vSrc,
              collectionList: Array.from(list[0].collectionList?.split(",")),
              upList: Array.from(list[0].upList?.split(","))
            }
          })

          this.getCommentByVideo()
        }
      })
    },
    getCommentByVideo() {
      wx.request({
        url: `${app.globalData.baseUrl}/home/GetvideoComments`,
        method: 'GET',
        data: {
          vId: this.data.playing.id
        },
        success: ({
          data
        }) => {
          if (data.success) {
            this.setData({
              commentList: data.commentList
            })
          } else {
            wx.showToast({
              title: '评论获取失败惹~',
              none: 'none'
            })
          }
        }
      })
    },
    changevideos(e) {
      const row = e.currentTarget.dataset.item;
      wx.showLoading()
      setTimeout(() => {
        wx.hideLoading({})
      }, 500)
      const _this = this
      this.setData({
        playing: {
          id: row.vId,
          name: row.vName,
          src: row.vSrc,
          collectionList: row.collectionList?.split(","),
          upList: row.upList?.split(",")
        }
      })
      _this.getCommentByVideo()
    },
    changePage(e) {
      wx.showLoading()
      const index = e.currentTarget.dataset.index;
      const arr = this.data.videoList.filter(e => e.vId === this.data.playing.id)
      const rowIndex = this.data.videoList.indexOf(arr[0]);

      setTimeout(() => {
        wx.hideLoading({})
      }, 500)
      if (+index) {
        // 下
        if (rowIndex + 1 == this.data.videoList.length) {
          wx.showToast({
            title: '当前已经是最后一集了！',
            icon: 'none'
          })
          return
        } else {
          const row = this.data.videoList[rowIndex + 1];
          this.setData({
            playing: {
              id: row.vId,
              name: row.vName,
              src: row.vSrc,
              collectionList: row.collectionList?.split(","),
              upList: row.upList?.split(",")
            }
          })
        }
      } else {
        // 上
        if (rowIndex - 1 < 0) {
          wx.showToast({
            title: '当前已经是第一集了！',
            icon: 'none'
          })
          return
        } else {
          const row = this.data.videoList[rowIndex - 1];
          this.setData({
            playing: {
              id: row.vId,
              name: row.vName,
              src: row.vSrc,
              collectionList: row.collectionList?.split(","),
              upList: row.upList?.split(",")
            }
          })
        }
      }
      this.getCommentByVideo();
    },
    videoUp(e) {
      const type = e.currentTarget.dataset.type;
      const _this = this;

      if (!this.data.timer) {
        console.log('设置定时器')

        this.setData({
          timer: setTimeout(() => {
            const data = {
              vId: this.data.playing.id,
              uId: this.data.user.uId,
              type: type
            }
            wx.showLoading()
            wx.request({
              url: `${app.globalData.baseUrl}/home/up`,
              method: "POST",
              data: data,
              success: (res) => {
                if (res.data.success) {
                  wx.showToast({
                    title: (+type ? '收藏' : '点赞') + '成功！',
                  })
                  wx.hideLoading();
                  _this.init();
                  this.setData({
                    timer: null,
                  })
                }
              }
            })
          }, 400)
        })
      } else {
        console.log('清除定时器')
        clearTimeout(this.data.timer);
        this.setData({
          timer: null,
        })
      }
    },
    startTouched() {
      // console.log('触摸hajime')
      this.setData({
        clicked: true
      })
    },
    endTouched() {

      // console.log('触摸owari')

      this.setData({
        clicked: false
      });

      // 发送评论事件

      if (this.data.comment) {
        wx.request({
          url: `${app.globalData.baseUrl}/home/comment`,
          method: "POST",
          data: {
            comment: this.data.comment,
            vId: this.data.playing.id,
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
              this.getCommentByVideo()
            } else {
              wx.showToast({
                title: '好像出了一点问题🤣',
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
    getComment(e) {
      this.setData({
        comment: e.detail.value
      })
    },
    upVideo(e) {
      // console.log('你点了赞', e.currentTarget.dataset.comment);
      const comment = e.currentTarget.dataset.comment
      // 发请求
      wx.showLoading()
      wx.request({
        url: `${app.globalData.baseUrl}/comment/up`,
        method: 'POST',
        data: {
          cId: comment.id,
          uId: this.data.user.uId,
        },
        success: () => {
          this.getCommentByVideo()
          wx.hideLoading();
        }
      })
    },
    downVideo(e) {
      const comment = e.currentTarget.dataset.comment
      wx.showLoading()
      const _this = this
      setTimeout(() => {
        this.setData({
          commentList: _this.data.commentList.map(e => {
            if (e.id == comment.id) {
              if (e?.down) {
                e.down = false
              } else {
                e.down = true
              }
            }
            return e
          })
        })
        wx.showToast({
          title: '成功！',
          icon: 'success'
        })
      }, 1000)
    }
  }
})