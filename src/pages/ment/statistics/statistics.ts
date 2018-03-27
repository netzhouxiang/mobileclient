import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private native: NativeService, private httpService: HttpService) {
  }
  getRadioType = '1';
  statisType = [{ text: "消息统计", val: 1 }, { text: "案件统计", val: 2 }, { text: "考勤统计", val: 4 }, { text: "案件统计(部门)", val: 5 }, { text: "人员统计(部门)", val: 3 }, { text: "考勤统计(部门)", val: 7 }, { text: "人员设施统计", val: 6 }];
  requestInfo = {
    url: 'statistics/list',
    user_id: this.native.UserSession._id,
    min_time: 0,
    max_time: 0,
    type: "0",
    department_id: ""
  }
  requestInfo3 = {//人员统计
    url: 'people/list',
    start_index: '0',
    length: '10000',
    department_id: this.native.UserSession.department_sub,
  }
  requestInfo5 = {//案件统计
    url: 'event/list',
    start_index: '0',
    length: '100000',
    department_id: this.native.UserSession.department_sub,
    start_time: 0,
    end_time: 0
  }
  sendMsg() {
    this.requestInfo.user_id = this.native.UserSession._id;
    this.requestInfo.department_id = "";
    if (this.getRadioType == '3') {
      this.perpoStatist();
    } else if (this.getRadioType == '6') {
      this.peoplemonage();
    } else if (this.getRadioType == '5') {
      this.eventlist();
    } else if (this.getRadioType == '7') {
      this.requestInfo.user_id = "";
      this.requestInfo.department_id = this.native.UserSession.department_sub;
      this.msgStatist();
    } else {
      this.msgStatist();
    }
  }
  //获取当前部门下 所有案件状态，案件类型对应案件数量
  eventlist() {
    this.getTime(this.requestInfo);
    this.requestInfo5.start_time = this.requestInfo.min_time;
    this.requestInfo5.end_time = this.requestInfo.max_time;
    this.httpService.post(this.requestInfo5.url, this.requestInfo5).subscribe(data => {
      let res = data.json();
      if (res.code != 200) {
        this.native.showToast(res.info);
      } else {
        if (!res.info.count) {
          this.native.alert('该时间段无数据');
        } else {
          let parmObj = {
            type: 'lineChart',
            getRadioType: this.getRadioType,
            typelist: []
          }
          //获取案件类型
          this.httpService.post("event_type/list", { dept_id: this.native.UserSession.department_sub }).subscribe(xata => {
            parmObj.typelist = xata.json().info;
            this.getChart(res.info.list, parmObj);
          });

        }
      }
    }, err => { this.native.showToast('获取案件统计信息失败'); });
  }
  //计算时间
  getTime(model) {
    var day_time = new Date();
    var riqi = day_time.getFullYear() + "/" + (day_time.getMonth() + 1) + "/" + day_time.getDate();
    var _create_time = Math.round(new Date(riqi).getTime() / 1000);
    switch (parseInt(model.type)) {
      case 0:
        model.min_time = _create_time;
        break;
      case 1:
        model.min_time = _create_time - 604800;
        model.max_time = _create_time;
        break;
      case 2:
        model.min_time = _create_time - 2592000;
        model.max_time = _create_time;
        break;
      case 3:
        model.min_time = 0;
        model.max_time = 0;
        break;
    }
  }
  msgStatist() {//消息，案件，考勤统计
    this.getTime(this.requestInfo);
    this.httpService.post(this.requestInfo.url, this.requestInfo).subscribe(data => {
      let res = data.json();
      if (res.code != 200) {
        this.native.showToast(res.info);
      } else {
        if (!res.info.list || !res.info.list.length) {
          this.native.alert('该时间段无数据');
        } else {
          let parmObj = {
            type: 'lineChart',
            getRadioType: this.getRadioType
          }
          this.getChart(res.info.list, parmObj);
        }
      }
    }, err => { this.native.showToast('获取统计信息失败'); });
  }
  perpoStatist() {//部门人员统计
    this.httpService.post(this.requestInfo3.url, this.requestInfo3).subscribe(data => {
      let res = data.json();
      let parmObj = {
        type: 'pie',
        getRadioType: this.getRadioType,
      }
      if (res.code === 200) {
        const rData = res.info.list
        let obj = {
          malecount: 0,
          femalecount: 0,
          unknownSexCount: 0,
          youngcount: 0,
          middlecount: 0,
          oldcount: 0,
          roles: {}
        }
        console.log(rData)
        rData.forEach(element => { //构造数据
          if (element.sex) {
            obj.femalecount++
          } else {
            obj.malecount++
          }
          const nDate = new Date()
          const oDate = new Date(element.birthday * 1000)
          const year = nDate.getFullYear() - oDate.getFullYear()
          if (year < 35) {
            obj.youngcount++
          } else if (year < 50) {
            obj.middlecount++
          } else {
            obj.oldcount++
          }
          if (element.role_id) {
            if (obj.roles[element.role_id]) {
              obj.roles[element.role_id].num++
            } else {
              obj.roles[element.role_id] = {
                role_name: element.role_name,
                num: 1
              }
            }
          }
        });
        this.getChart(obj, parmObj);
      }
    }, err => { });
  }
  peoplemonage() { // 人员设施统计
    this.httpService.post('statistics/peoplemongo').subscribe(data => {
      let res = data.json();
      let parmObj = {
        type: 'bar',
        getRadioType: this.getRadioType,
      }
      if (res.code === 200) {
        const rData = res.info.list
        let obj = {
          biao1: {
            aa: ["正常", "脱贫", "外出", "生病"],
            class: [],
            a1: [],
            a2: [],
            a3: [],
            a4: []
          },
          biao2: {
            aa: ['正常', '完全损坏', '部分损坏', '丢失'],
            class: [],
            a1: [],
            a2: [],
            a3: [],
            a4: []
          }
        }
        rData.forEach(element => { //构造数据
          if (element.fortab == 0) {
            obj.biao1.class.push(element.class)
            obj.biao1.a1.push(element.status1)
            obj.biao1.a2.push(element.status2)
            obj.biao1.a3.push(element.status3)
            obj.biao1.a4.push(element.status4)
          } else {
            obj.biao2.class.push(element.class)
            obj.biao2.a1.push(element.status1)
            obj.biao2.a2.push(element.status2)
            obj.biao2.a3.push(element.status3)
            obj.biao2.a4.push(element.status4)
          }
        });
        this.getChart(obj, parmObj);
      }
    }, err => { });
  }
  getChart(res, parmObj) {
    this.navCtrl.push('ChartsPage', { resultData: res, parmObj: parmObj });
  }
}
