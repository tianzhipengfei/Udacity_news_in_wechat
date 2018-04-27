// pages/detail/detail.js
var newID = 0;
var touchDirection = 0;
var touchDot = 0;//触摸时的原点
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理时间记录


Page({
  data: {
      contentList: [],
    countNum: "",
    title: "",
    date: "",
    generateOk:false,
  },
  onLoad(options){
      newID = options ? options.newsID : 0;
      this.getNews(newID);
      setTimeout(() => {
          this.setData({
              generateOk: true
          })
      }, 800)

  },
  getNews(newsID){
      wx.request({
          url: 'https://test-miniprogram.com/api/news/detail',
          data: {
              "id": newsID
          },
          success: res => {
            if (res.data.message != "success") {
                return;
            }
            let result = res.data.result;
            this.preprocess(result);
            this.setData({
                title: result.title,
                date: result.date,
                countNum: "阅读 "+result.readCount,
                contentList: result.content
            })
          },
          fail:()=>{
              this.setData({
                  contentList: [
                      {
                          "type": "image",
                          "src": "/images/404-bg.jpg",
                          "id": 2
                      },
                      {
                          "type": "strong",
                          "text": "&nbsp;你来到了没有知识的荒原 :(",
                          "id": 1
                      }
                  ],
                  countNum: "阅读 " + 0,
                  title: "404 Not Found",
                  date: "Futrue"
              })
          }
      })
  },
  preprocess(result){
      if (result.source == "") {
          result.source = "网络媒体"
      }
      result.date = result.source + "   " + result.date.slice(11, 16);
  },
  backToHome(){
      wx.navigateBack({
          delta: 1
      })
  },
  // 触摸开始事件
  touchStart: function (e) {
      touchDot = e.touches[0].pageX; // 获取触摸时的原点
      // 使用js计时器记录时间  
      interval = setInterval(function () {
          time++;
      }, 100);
  },
  // 触摸移动事件
  touchMove: function (e) {
      var touchMove = e.touches[0].pageX;
      // 向左滑动  
      if (touchMove - touchDot <= -180 && time < 100) {
          touchDirection = 1;
      }
      // 向右滑动
      if (touchMove - touchDot >= 180 && time < 100) {
          touchDirection = -1;
      }
  },
  // 触摸结束事件
  touchEnd: function (e) {
      if (touchDirection == -1) {
          console.log("right");
      } else if (touchDirection == 1) {
        console.log("left");
      } 
      if (touchDirection != 0)
      this.changeNews(touchDirection);
      clearInterval(interval); // 清除setInterval
      time = 0;
      touchDirection = 0;
  },
  changeNews(num){
      this.setData({
          generateOk: false
      });
      newID = parseInt(newID) + num;
      this.getNews(newID);
      setTimeout(() => {
          this.setData({
              generateOk: true
          })
      }, 800);
  }
})