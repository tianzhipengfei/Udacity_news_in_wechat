// pages/detail/detail.js
Page({
  data: {
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
    countNum: 0,
    title: "404 Not Found",
    date: "Futrue",
  },
  onLoad(options){
      let newsID = options ? options.newsID : 0;
      this.getNews(newsID);
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
                countNum: result.readCount,
                contentList: result.content
            })
          }
      })
  },
  preprocess(result){
      if (result.source == "") {
          result.source = "网络媒体"
      }
      result.date = result.source + "   " + result.date.slice(11, 16);
  } 
})