//index.js
let SELECTTYPECOLOR = "#fdfcfb";
let UNSELECTTYPECOLOR = "#e2d1c3";

var touchDirection = 0;
var touchDot = 0;//触摸时的原点
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理时间记录

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
        selectedNewsType: "gn"
    },
    onLoad(){
        this.getLatestNews();
    },
    onPullDownRefresh(){
        this.getLatestNews(() => wx.stopPullDownRefresh());
    },
    selecNewsType(e){
        if (this.data.selectedNewsType == e.currentTarget.dataset.ab){
            return ;
        }
        this.data.newsTypeList.forEach(function(value){
            if (value.ab == e.currentTarget.dataset.ab){
                value.color = SELECTTYPECOLOR;
            } else{
                value.color = UNSELECTTYPECOLOR;
            }
        });
        this.setData({
            newsTypeList: this.data.newsTypeList,
            selectedNewsType: e.currentTarget.dataset.ab
        })
        this.getLatestNews();
    },
    clickNormalNews(e) {
        console.log(e.currentTarget.dataset.id)
    },
    clickTopNews(e) {
        console.log(e.currentTarget.dataset.id)
    },
    getLatestNews(callback){
        wx.request({
            url: 'https://test-miniprogram.com/api/news/list',
            data: {
                "type": this.data.selectedNewsType
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
            },
            complete: () => {
                callback && callback()
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
        this.changeNewsType(touchDirection);
        clearInterval(interval); // 清除setInterval
        time = 0;
        touchDirection = 0;
    },
    changeNewsType(num){
        for (var i= 0; i < this.data.newsTypeList.length; i++){
            if (this.data.newsTypeList[i].ab == this.data.selectedNewsType){
                if((num == -1 && i == 0) || (num == 1 && i == this.data.newsTypeList.length-1)){
                    return ;
                } else{
                    this.data.newsTypeList[i].color = UNSELECTTYPECOLOR;
                    this.data.newsTypeList[i+num].color = SELECTTYPECOLOR;
                    this.data.selectedNewsType = this.data.newsTypeList[i + num].ab;
                    break;
                }
            }
        }
        this.setData({
            newsTypeList: this.data.newsTypeList,
            selectedNewsType: this.data.selectedNewsType
        });
        this.getLatestNews();
    }
})