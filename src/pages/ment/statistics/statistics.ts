import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
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
  getRadioType=1;
  statisType=[{text:"消息统计",val:1},{text:"事件统计",val:2}];
  requestInfo = { //消息统计
    url:'message/countByMessages',
    personId:this.native.UserSession._id,
    sTime: Utils.dateFormat(new Date(new Date().getTime()-7*24*3600*1000)),//默认一周前
    eTime: Utils.dateFormat(new Date()),
    countType: 'sendMessage',
    timespan: 'day'
  }
  requestInfo2={
    url:'mobilegrid/geteventTimestatistics',
    personID:this.native.UserSession._id,
    startTime: Utils.dateFormat(new Date(new Date().getTime()-7*24*3600*1000)),//默认一周前
    ediTime: Utils.dateFormat(new Date()),
    countType: '0',
    start:'',
    end:'',
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
  sendMsg() {
    if(this.getRadioType===1){//消息统计
        this.msgStatist();
    }else if(this.getRadioType===2){

    }
    
  }
  msgStatist(){
        this.httpService.post(this.requestInfo.url, this.requestInfo).subscribe(data => {
              let res = data.json();
              let parmObj={
                type:'lineChart',
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
                    this.requestInfo.timespan='day';
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
  ionViewDidLoad() {
   
  }
  getChart(res,parmObj) {
    this.navCtrl.push('ChartsPage',{resultData:res,parmObj:parmObj});
  }
}
