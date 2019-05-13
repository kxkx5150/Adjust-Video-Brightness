let ipng = chrome.extension.getURL('icon24.png');
let cpng = chrome.extension.getURL('close.png');
function AVB(video,pos,fobj){

    this.on = false;
    this.Icon = null;
    this.ctrlpanel = null;
    this.timerid1 = null;
    this.video = video;
    this.vpos = null;
    pos.height ? this.h = pos.height : this.h = 24;
    pos.width ? this.w = pos.width : this.w = 24;
    pos.top ? this.t = pos.top : this.t = 10;
    pos.left ? this.l = pos.left : this.l = 10;
    pos.right ? this.r = pos.right : this.r = 10;
    pos.lflg ? this.lflg = true : this.lflg = false;

    if(fobj){
        this.fobj = fobj;
    }else{
        this.fobj = {
            br:100,
            co:100,
            sa:100,
            hu:0,
            gr:0,
            se:0
        };    
    }

    this.init = () => {
        this.createIcon();
        this.createControlPanel();
        this.getVideoPosition();
        this.attachMouseMoveEvent();
    };
    this.attachMouseMoveEvent = () => {
        let tid1 = null;
        window.addEventListener("mousemove",( e ) => {
            let vpos = this.vpos;
            if(vpos){
                clearTimeout(tid1);
                tid1 = setTimeout(() => {
                    this.checkMousePosition(e,vpos)
                },10);
            }
        },true);
    };
    this.checkMousePosition = (e,vpos) => {
        let px = e.pageX;
        let py = e.pageY;
        if(vpos.left < px && px < vpos.left + vpos.width){
            if(vpos.top < py && py < vpos.top + vpos.height){
                this.showIcon();
                clearTimeout(this.timerid1);
                this.timerid1 = setTimeout(() =>{
                    this.hideIcon();
                },3600);
            }
        }
    };
    this.createIcon = () => {
        let cont = document.createElement("img");
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
        cont.style.background = "#aaa";
        cont.style.borderRadius = "3px";
        cont.src = ipng;




        cont.addEventListener("click",(e) => {
            e.stopPropagation();
            e.preventDefault();
            let pelem = this.ctrlpanel;
            if(pelem.style.display == "none"){
                this.showControlPanel();
            }else{
                this.hideControlpanel();
            }
        })
        this.Icon = cont;
    };
    this.hideIcon = (flg) => {
        let elem = this.Icon;
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
        let elem = this.Icon;
        if(!elem)return;
        elem.style.display = "block";
        setTimeout(() => {
            elem.style.opacity = 1;
        },10);
    };




    this.createControlPanel = () => {
        let  mcont = document.createElement("div");
        document.body.appendChild(mcont);
        mcont.style.fontFamily = "Arial, sans-serif";
        mcont.style.fontSize = "12px";
        mcont.style.zIndex = 2147483647;
        mcont.style.position = "fixed";
        mcont.style.top = 0;
        mcont.style.right = 0;
        mcont.style.margin = 0;
        mcont.style.padding = 0;
        mcont.style.width = "200px";
        mcont.style.height = "100%";
        mcont.style.opacity = 1;
        mcont.style.display = "none";
        mcont.style.background = "#444";
        mcont.style.textAlign = "center";
        this.ctrlpanel = mcont;

        let closecont = document.createElement("div");
        mcont.appendChild(closecont); 
        closecont.style.position = "relative";
        closecont.style.margin = 0;
        closecont.style.padding = "16px 3px 24px 3px";

        let lbl = document.createElement("label");
        closecont.appendChild(lbl); 
        lbl.textContent = "Brightness & Color";
        lbl.style.fontSize = "14px";
        lbl.style.color = "aquamarine";

        let icon = document.createElement("img");
        closecont.appendChild(icon); 
        icon.style.position = "absolute";
        icon.style.top = "3px";
        icon.style.right = "3px";
        icon.style.padding = 0;
        icon.style.width = "24px";
        icon.style.height = "24px";
        icon.src = cpng;
        icon.addEventListener("click",(e) => {
            e.stopPropagation();
            e.preventDefault();
            this.hideControlpanel();
        },true);

        let  rcont = document.createElement("div");
        mcont.appendChild(rcont); 
        let rbtn = document.createElement("button");
        mcont.appendChild(rbtn); 
        rbtn.textContent = "Reset";
        rbtn.style.padding = "2px";
        rbtn.style.width = "100px";
        rbtn.style.margin = 0;
        rbtn.style.padding = "4px";
        rbtn.style.border = 0;
        rbtn.style.borderRadius = "10px";

        rbtn.addEventListener("click",(e) => {
            e.stopPropagation();
            e.preventDefault();
            this.resetSlideBar();           
            this.fobj = {
                br:100,
                co:100,
                sa:100,
                hu:0,
                gr:0,
                se:0
            };
            this.attachCSS();
        },true);

        let  cont = document.createElement("div");
        mcont.appendChild(cont); 
        cont.style.position = "relative";
        cont.style.margin = 0;
        cont.style.padding = 0;
        cont.style.paddingTop = "18px";
        cont.style.paddingBottom = "18px";

        this.createSlideBar(300,0,1,100,"br","Brightness",cont);
        this.createSlideBar(300,0,1,100,"co","Contrast",cont);
        this.createSlideBar(500,0,1,100,"sa","Saturate",cont);
        this.createSlideBar(360,0,1,0,"hu","Hue-rotate",cont);
        this.createSlideBar(1,0,0.1,0,"gr","Sepia",cont);
        this.createSlideBar(1,0,0.1,0,"se","Grayscale",cont);


        this.createSpeedInput(mcont);

    };
    this.createSpeedInput = (mcont) => {
        let  cont = document.createElement("div");
        mcont.appendChild(cont); 
        cont.style.paddingTop = "24px";
        cont.style.paddingBottom = "8px";

        let  lblcont = document.createElement("div");
        cont.appendChild(lblcont); 
        let lbl = document.createElement("label");
        lblcont.appendChild(lbl); 
        lblcont.style.padding = "4px 0 8px 0";
        lbl.textContent = "Playback Rate";
        lbl.style.fontSize = "14px";
        lbl.style.color = "deeppink";

        let ninpt = document.createElement("input");
        cont.appendChild(ninpt);
        ninpt.setAttribute("type","number");
        ninpt.setAttribute("max",4.0);
        ninpt.setAttribute("min",0.5);
        ninpt.setAttribute("step",0.02);
        ninpt.setAttribute("value",1);
        ninpt.style.fontSize = "18px";
        ninpt.style.margin = 0;
        ninpt.style.padding = "3px";
        ninpt.style.width = "100px";
        ninpt.style.textAlign = "center";
        ninpt.style.borderRadius = "12px";
        ninpt.style.border = 0;
        ninpt.addEventListener("change",(e) => {
            this.video.playbackRate = e.target.value;
            e.stopPropagation();
        },true);;
    };

    this.createSlideBar = (max,min,step,val,name,lbltxt,pcont) => {
        let  cont = document.createElement("div");
        pcont.appendChild(cont);
        cont.style.margin = 0;
        cont.style.padding = 0;
        cont.style.paddingTop = "8px";

        let lcont = document.createElement("div");
        cont.appendChild(lcont);
        let lbl = document.createElement("label");
        lcont.appendChild(lbl);
        lbl.style.margin = 0;
        lbl.style.padding = "3px";
        lbl.style.width = "100px";
        lbl.style.textAlign = "center";
        lbl.style.color = "#999";
        lbl.textContent = lbltxt;

        let range = document.createElement("input");
        cont.appendChild(range);

        range.setAttribute("type","range");
        range.setAttribute("max",max);
        range.setAttribute("min",min);
        range.setAttribute("step",step);
        range.setAttribute("value",val);
        this.attachRangeEvent(range,name);
    };
    this.resetSlideBar = () => {
        let panel = this.ctrlpanel; 
        let rs = panel.querySelectorAll("input[type='range']")
        for (let r of rs){
            let name = r.getAttribute("data-val");
            if(name === "br"){
                r.value = 100;
            }else if(name === "co"){
                r.value = 100;
            }else if(name === "sa"){
                r.value = 100;
            }else if(name === "hu"){
                r.value = 0;
            }else if(name === "se"){
                r.value = 0;
            }else if(name === "gr"){
                r.value = 0;

            }

        }
    };
    this.attachRangeEvent = (range,name) => {
        range.setAttribute("data-val",name);
        range.addEventListener("change",(e) => {
            let range = e.target;
            let name = range.getAttribute("data-val");
            this.fobj[name] = range.value;
            this.attachCSS();
        });
    }
    this.attachCSS = () => {
        let video = this.video;
        let fobj = this.fobj;
        let css = ""
        +"brightness("+fobj.br+"%) "
        +"contrast("+fobj.co+"%) "
        +"saturate("+fobj.sa+"%) "
        +"hue-rotate("+fobj.hu+"deg) "
        +"sepia("+fobj.se+") "
        +"grayscale("+fobj.gr+")";
        video.style.setProperty("filter", css, "important")
    };
    this.showControlPanel = (e) => {
        let pelem = this.ctrlpanel;
        pelem.style.display = "block";
    };
    this.hideControlpanel = (e) => {
        let pelem = this.ctrlpanel;
        pelem.style.display = "none";
    };









    this.resize = () => {
        this.getVideoPosition();
    };
    this.getVideoPosition = () => {
        let video = this.video;
        let pos = this.getAbsolutePosition(video);
        if(pos){
            this.setPosition(pos);
            this.vpos = pos;
        }else{
            this.hideIcon(true);
            this.vpos = null;
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
                width:rect.width,
                height:rect.height
            };
        }
        return false;
    };
    this.setPosition = (pos) => {
        let elem = this.Icon;
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



                let fobj = {
                    br:100,
                    co:100,
                    sa:100,
                    hu:0,
                    gr:0,
                    se:0
                };    

                let avb = new AVB(video,pos,fobj);
                this.items.push(avb);
                this.resizeObserver.observe(video);
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


