function AVB(video,pos){

    this.on = false;
    this.elem = null;
    this.timerid = null;
    this.video = video;

    pos.height ? this.h = pos.height : this.h = 24;
    pos.width ? this.w = pos.width : this.w = 24;
    pos.top ? this.t = pos.top : this.t = 10;
    pos.left ? this.l = pos.left : this.l = 10;
    pos.right ? this.r = pos.right : this.r = 10;
    pos.lflg ? this.lflg = true : this.lflg = false;

    this.init = () => {
        this.createIcon()
        this.getVideoPosition();
    };
    this.createIcon = () => {
        let cont = document.createElement("div");
        document.body.appendChild(cont);
        cont.style.display = "none";
        cont.style.position = "absolute";
        cont.style.top = 0;
        cont.style.left = 0;
        cont.style.padding = 0;
        cont.style.margin = 0;        
        cont.style.zIndex = 2147483645;
        cont.style.opacity = 0;
        cont.style.transition = "0.5s";  
        cont.style.transitionProperty = "opacity";        
        cont.style.height = this.h + "px";
        cont.style.width = this.h + "px";
        cont.style.background = "blue";
        this.elem = cont;
    };
    this.hideIcon = (flg) => {
        let elem = this.elem;
        if(elem)elem.style.opacity = 0;
        if(flg){
            elem.style.display = "none";
        }else{
            setTimeout(() => {
                elem.style.display = "none";
            },500);
        }
    };
    this.showIcon = () => {
        let elem = this.elem;
        if(!elem)return;
        elem.style.display = "block";
        setTimeout(() => {
            elem.style.opacity = 1;
        },10);
    };
    this.resize = () => {
        this.getVideoPosition();
    };
    this.getVideoPosition = () => {
        let video = this.video;
        let pos = this.getAbsolutePosition(video);
        
        if(pos){
            this.setPosition(pos);
        }else{
            this.hideIcon(true);
        }
    };
    this.getAbsolutePosition = (video)  => {
        let html = document.documentElement;
        let body = document.body;           
        let rect = video.getClientRects()[0];
        if(rect){
            let recr = rect.right,recl = rect.left;  
            let left = (body.scrollLeft || html.scrollLeft) - html.clientLeft + recl;
            let top =  (body.scrollTop || html.scrollTop ) - html.clientTop + rect.top;
            if(top < 0)top = 0;
            return {
                top:top,
                left: left,
                width:rect.width
            }
        }
        return false;
    };
    this.setPosition = (pos) => {
        let elem = this.elem;
        elem.style.height = this.h +"px";
        elem.style.width = this.w +"px";
        elem.style.top = pos.top + this.t + "px";

        if(this.lflg){
            elem.style.left = pos.left + this.l + "px";
        }else{
            elem.style.left = pos.left + pos.width - this.r - this.w + "px";
        }
    };
    this.init();
}
const AVBs = {
    items:[],
    resizeObserver:null,
    init:function(count){
        let videos = document.querySelectorAll("video");        
        if(0 < videos.length){
            this.attachEvent();
            videos.forEach((video, index) => {
                let pos = {
                    height:24,
                    width:24,
                    top:16,
                    left:12,
                    right:12,
                    lflg:true
                };
                let avb = new AVB(video,pos);
                this.items.push(avb);
                this.resizeObserver.observe(video);

                avb.showIcon();


                // let tid1 = null;
                // let tid2 = null;       
                // video.parentNode.parentNode.addEventListener("mousemove",( e ) => {
                //     clearTimeout(tid1);
                //     clearTimeout(tid2);
                //     tid1 = setTimeout(() => {
                //         avb.showIcon();
                //     },10);
                //     tid2 = setTimeout(() =>{
                //         avb.hideIcon();
                //     },3600);
                // },true);
            });
        }else if (count < 8) {
            setTimeout(() => {
                this.init(++count);
            },1000);
        }
    },
    attachEvent:function(){
        let tid = null;
        this.resizeObserver = new ResizeObserver(entries => {
            clearTimeout(tid);
            tid = setTimeout(() => {
                this.resize();
            },1100);
        });
        document.addEventListener("fullscreenchange", (e) => {
            this.resize();
        });
    },
    resize:function(){
        this.items.forEach((avb,index) => {
            avb.resize();
        });
    }
};
AVBs.init(0);


