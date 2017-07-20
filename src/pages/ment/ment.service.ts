import { Injectable } from '@angular/core';
import { HttpService } from "../../providers/http.service";
import { ChatService } from "../../providers/chat-service";
@Injectable()
export class MentService {
    //当前位置  
    location = {
        text: "正在获取定位",//物理地址
        name: "正在获取定位",//简称
        loc: [0, 0]//经纬度
    };
    constructor(public httpService: HttpService, public chatser: ChatService, ) {
    }

    //获取所有已定义的事件类型
    getAllAbstracttype() {
        return this.httpService.post("mobilegrid/getAllAbstracttype", {
            hideloading: true
        });
    }
    //添加事件
    addEvent(subdata) {
        return this.httpService.post("mobilegrid/sendnewEvent", subdata);
    }
}