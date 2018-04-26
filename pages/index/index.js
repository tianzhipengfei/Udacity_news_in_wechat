//index.js
let SELECTTYPECOLOR = "#fdfcfb";
let UNSELECTTYPECOLOR = "#e2d1c3";

Page({
    data:{
        newsTypeList: [
            { "text": "国内", "ab": "gn", "index": "0", "color":SELECTTYPECOLOR }, 
            { "text": "国际", "ab": "gj", "index": "1", "color": UNSELECTTYPECOLOR }, 
            { "text": "财经", "ab": "cj", "index": "2", "color": UNSELECTTYPECOLOR }, 
            { "text": "娱乐", "ab": "yl", "index": "3", "color": UNSELECTTYPECOLOR }, 
            { "text": "军事", "ab": "js", "index": "3", "color": UNSELECTTYPECOLOR }, 
            { "text": "体育", "ab": "ty", "index": "4", "color": UNSELECTTYPECOLOR }, 
            { "text": "其他", "ab": "other", "index": "5", "color": UNSELECTTYPECOLOR }
            ],
        topNewsList: [],
        normalNewsList: [],
        selectNewsType: "gn"
    },
    onLoad(){
        this.getLatestNews();
    },
    selecNewsType(e){
        this.data.newsTypeList.forEach(function(value){
            if (value.ab == e.currentTarget.dataset.ab){
                value.color = SELECTTYPECOLOR;
            } else{
                value.color = UNSELECTTYPECOLOR;
            }
        });
        this.setData({
            newsTypeList: this.data.newsTypeList,
            selectNewsType: e.currentTarget.dataset.ab
        })
        this.getLatestNews();
    },
    clickNormalNews(e) {
        console.log(e.currentTarget.dataset.id)
    },
    clickTopNews(e) {
        console.log(e.currentTarget.dataset.id)
    },
    getLatestNews(){
        wx.request({
            url: 'https://test-miniprogram.com/api/news/list',
            data: {
                "type": this.data.selectNewsType
            },
            success: res => {
                let result = res.data.result;
                this.preprocess(result);
                var tempList1 = [], tempList2 = [];
                for (var i = 0; i < 2; i++) {
                    tempList1.push(result[i]);
                }
                for (var i = 2; i < result.length; i++) {
                    tempList2.push(result[i]);
                }
                this.setData({
                    topNewsList: tempList1,
                    normalNewsList: tempList2
                })
            }
        })
    },
    preprocess(result){
        for(var i=0; i<result.length; i++){
            //解决无图片的情况
            if(result[i].firstImage == ""){
                result[i].firstImage = "/images/news_image_bg.jpg";
            }
            //解决无新闻源的情况
            if (result[i].source == ""){
                result[i].source = "网络媒体"
            }
            result[i].date = result[i].source + "   " + result[i].date.slice(11, 16);
        }
    }
})