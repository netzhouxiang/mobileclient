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
    //当前部门id
    dept = null;
    constructor(public httpService: HttpService, public chatser: ChatService, ) {
        
        this.dept = this.chatser.deptlist[0];
    }

    //获取所有已定义的事件类型
    getAllAbstracttype() {
        return this.httpService.post("mobilegrid/getAllAbstracttypetodep", {
            departmentID: this.dept._id
        });
    }
    //添加事件
    addEvent(subdata) {
        return this.httpService.post("mobilegrid/sendnewEvent", subdata);
    }
    //获取案件所有步骤
    getcasestep(id) {
        return this.httpService.post("mobilegrid/getcasestep", {
            id: id,
            hideloading: true
        });
    }
    //获取当前步骤
    getcurrentstep(id) {
        return this.httpService.post("mobilegrid/getcurrentstep", {
            _id: id
        });
    }
    //根据步骤获取需提交的参数
    getargutostep(id) {
        return this.httpService.post("mobilegrid/getargutostep", {
            id: id
        });
    }
    //保存参数
    sendeventargument(data) {
        return this.httpService.post("mobilegrid/sendeventargument", data);
    }
    //保存参数并审核
    sendeventargumentpush(data) {
        return this.httpService.post("mobilegrid/sendeventargumentpush", data);
    }
    //获取当前正在审核的步骤
    getcurrentexaminestep(id) {
        return this.httpService.post("mobilegrid/getcurrentexaminestep", {
            _id: id
        });
    }
    //获取部门法律法规
    getdepartmentlaw(deptid) {
        return this.httpService.post("mobilegrid/getdepartmentlaw", {
            department: deptid
        });
    }
    //拒绝审核
    sendeventargbackoff(model) {
        return this.httpService.post("mobilegrid/sendeventargbackoff", model);
    }
    //同意审核
    sendstepgo(model) {
        return this.httpService.post("mobilegrid/sendstepgo", model);
    }
    //获取所有部门
    getAllDepartments() {
        return this.httpService.post("personadminroute/getAllDepartments", {});
    }
}