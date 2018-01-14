import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { debuglog } from 'util';
/**
 * Generated class for the StatisticsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,private native: NativeService,private httpService: HttpService) {
  }
  getRadioType='2';
  // statisType=[{text:"消息统计",val:1},{text:"事件统计",val:2},{text:"人员统计",val:3},{text:'里程统计',val:4}];
  statisType=[{text:"事件统计",val:2},{text:"人员统计",val:3}];
  requestInfo = { //消息统计
    url:'message/countByMessages',
    personId:this.native.UserSession._id,
    sTime: Utils.dateFormat(new Date(new Date().getTime()-7*24*3600*1000)),//默认一周前
    eTime: Utils.dateFormat(new Date()),
    countType: 'sendMessage',
    timespan: 'day'
  }
  requestInfo2={//事件统计
    url:'mobilegrid/geteventTimestatistics',
    personID:this.native.UserSession._id,
    startTime: Utils.dateFormat(new Date(new Date().getTime()-7*24*3600*1000)),//默认一周前
    ediTime: Utils.dateFormat(new Date()),
    countType: '0',
    start:'',
    end:'',
  }
  requestInfo3={//人员统计
    url:'people/list',
    start_index: '0', 
    length: '10000',
    department_id:this.native.UserSession.department._id,
  }
  requestInfo4 = { //里程统计
    url:'/person/countByPersonLocations',
    personid:this.native.UserSession._id,
    sartTime: Utils.dateFormat(new Date(new Date().getTime()-7*24*3600*1000)),//默认一周前
    endTime: Utils.dateFormat(new Date()),
    timetype: 'day'
  }
  maxDate=Utils.dateFormat(new Date());
  compareTime1(type) {//限制始日期不能大于终日期
    let strDate = new Date(this.requestInfo.sTime).getTime();
    let endDate = new Date(this.requestInfo.eTime).getTime();
    if (strDate < endDate) {
      return false;
    }
    if (type) {
      this.requestInfo.sTime = this.requestInfo.eTime;
    } else {
      this.requestInfo.eTime = this.requestInfo.sTime;
    }
  }

  compareTime2(type) {//限制始日期不能大于终日期
    let strDate = new Date(this.requestInfo2.startTime).getTime();
    let endDate = new Date(this.requestInfo2.ediTime).getTime();
    if (strDate < endDate) {
      return false;
    }
    if (type) {
      this.requestInfo2.startTime = this.requestInfo2.ediTime;
    } else {
      this.requestInfo2.ediTime = this.requestInfo2.startTime;
    }
  }
  compareTime3(type) {//限制始日期不能大于终日期
    let strDate = new Date(this.requestInfo4.sartTime).getTime();
    let endDate = new Date(this.requestInfo4.endTime).getTime();
    if (strDate < endDate) {
      return false;
    }
    if (type) {
      this.requestInfo4.sartTime = this.requestInfo4.endTime;
    } else {
      this.requestInfo4.endTime = this.requestInfo4.sartTime;
    }
  }
  sendMsg() {
    if(this.getRadioType=='1'){//消息统计
        this.msgStatist();
    }else if(this.getRadioType=='2'){
      this.native.alert('开发中...');
    }else if(this.getRadioType=='3'){
        this.perpoStatist();
    }else if(this.getRadioType=='4'){
      this.mileageStatist();
    }
    
  }
  msgStatist(){//消息统计
        this.httpService.post(this.requestInfo.url, this.requestInfo).subscribe(data => {
              let res = data.json();
              let parmObj={
                type:'lineChart',
                getRadioType:this.getRadioType,
                timespan:this.requestInfo.timespan,
              }
              if (res.error) {
                this.native.showToast(res.error.error);
              }else{
                if(!res.length){
                    this.native.alert('该时间段无数据');
                }else{
                  if(res.length<8){
                    this.getChart(res,parmObj);
                  }else if(res.length>7&&res.length<49){
                    this.requestInfo.timespan='week';
                    this.sendMsg();
                  }else if(res.length>48){
                     this.requestInfo.timespan='month';
                    this.sendMsg();
                  }
                  
                }
               
              }
        }, err => { this.native.showToast('获取消息统计信息失败'); });
  }
   perpoStatist(){//部门人员统计
    this.httpService.post(this.requestInfo3.url, this.requestInfo3).subscribe(data => {
      let res = data.json();
      let parmObj={
        type:'pie',
        getRadioType:this.getRadioType,
      }
      if(res.code === 200){
        const rData = res.info.list
        let obj = {
          malecount:0,
          femalecount:0,
          unknownSexCount:0,
          youngcount:0,
          middlecount:0,
          oldcount:0,
          roles:{}
        }
        rData.forEach(element => { //构造数据
          if (element.sex) {
            obj.femalecount++
          } else {
            obj.malecount++
          }
          const nDate = new Date()
          const oDate = new Date(element.birthday*1000)
          const year = nDate.getFullYear() - oDate.getFullYear()
          if(year<35){
            obj.youngcount++
          }else if(year<50){
            obj.middlecount++
          }else {
            obj.oldcount++
          }
          if(obj.roles[element.role_id]) {
            obj.roles[element.role_id].num++
          }else {
            obj.roles[element.role_id] = {
              role_name : element.role_name,
              num:1
            }
          }
        });
        this.getChart(obj,parmObj);
      }
    }, err => {  });
  }
  mileageStatist(){//人员里程统计
      this.httpService.post(this.requestInfo4.url, this.requestInfo4).subscribe(data => {
              let res = data.json();
              let parmObj={
                type:'lineChart',
                getRadioType:this.getRadioType,
                timetype:this.requestInfo4.timetype,
              }
              if (res.error) {
                this.native.showToast(res.error.error);
              }else{
                if(!res.success.length){
                    this.native.alert('该时间段无数据');
                }else{
                  if(res.success.length<8){
                    this.getChart(res.success,parmObj);
                  }else if(res.success.length>7&&res.successs.length<49){
                    this.requestInfo4.timetype='week';
                    this.sendMsg();
                  }else if(res.success.length>48){
                     this.requestInfo4.timetype='month';
                    this.sendMsg();
                  }
                  
                }
              }
        }, err => {  });
  }
  getChart(res,parmObj) {
    this.navCtrl.push('ChartsPage',{resultData:res,parmObj:parmObj});
  }
}
