import { Component, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { Utils } from "../../../../providers/Utils";
import { HttpService } from "../../../../providers/http.service";
@IonicPage()
@Component({
  selector: 'page-charts',
  templateUrl: 'charts.html'
})
export class ChartsPage {
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('pieCanvas1') pieCanvas1;
  @ViewChild('pieCanvas2') pieCanvas2;
  @ViewChild('pieCanvas3') pieCanvas3;
  lineChart: any;
  resultData: any;
  parmObj: any;
  pageTitle: any;
  tongjiname:any;
  constructor(public navParams: NavParams, public navCtrl: NavController,private httpService: HttpService) {
    this.resultData = navParams.get('resultData');
    this.parmObj = navParams.get('parmObj');
  }

  ionViewDidLoad() {
    if (this.resultData) {
      if (this.parmObj.getRadioType == 1) {
        this.lineChart = this.getLineChart();
        this.pageTitle = '事件统计';
        this.tongjiname='事件统计';
      }else if(this.parmObj.getRadioType == 2){

      }else if(this.parmObj.getRadioType == 3){
        this.pageTitle = '人员统计';
        this.getPieChart(this.resultData);
      }else if(this.parmObj.getRadioType == 4){
        this.pageTitle = '里程统计';
        this.tongjiname='里程统计';
        this.getLineChart2();
      }

    }

  }

  updateData() {
    // After instantiating your chart, its data is accessible and can be changed anytime with the function update().
    // // It takes care of everything and even redraws the animations :D
    // this.pieChart.data.datasets[0].data = [Math.random() * 1000, Math.random() * 1000, Math.random() * 1000];
    // this.pieChart.update();
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      type: chartType,
      data: data,
      options: options
    });
  }
  getColor(){
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
  }
  getLineChart() {
    var data = {
      labels: [],
      datasets: []
    };
    let Parent =(label)=> {
      let color1 = this.getColor();
      let color2 = this.getColor();
      let color3 = this.getColor();
      let data = {
        fill: false,
        lineTension: 0.1,
        backgroundColor: color3,
        borderWidth: 1,
        borderColor: color1,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: color1,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color1,
        pointHoverBorderColor: color2,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        label: label,
        data: [],
        spanGaps: false,
      }
      return data;
    }
    let broadcastTypeCount = Parent('广播'),
      mesaageTypeCount = Parent('工作'),
      shiftTypeCount = Parent('换班'),
      takeoffApprove = Parent('放假'),
      takeoffTypeCount = Parent('请假'),
      textCount = Parent('文本'),
      videoCount = Parent('视频'),
      voiceCount = Parent('音频'),
      imageCount = Parent('图片');
    this.resultData.forEach((obj) => {
      let x;
      if (this.parmObj.timespan == 'day') {
        x = Utils.dateFormat(new Date(obj._id), 'MM/dd');
      } else if (this.parmObj.timespan == 'week') {
        x = obj._id + '周';
      } else if (this.parmObj.timespan == 'month') {
        x = obj._id + '月';
      }

      data.labels.push(x);
      broadcastTypeCount.data.push(obj.broadcastTypeCount);
      mesaageTypeCount.data.push(obj.mesaageTypeCount);
      shiftTypeCount.data.push(obj.shiftTypeCount);
      takeoffApprove.data.push(obj.takeoffApprove);
      takeoffTypeCount.data.push(obj.takeoffTypeCount);
      textCount.data.push(obj.textCount);
      videoCount.data.push(obj.videoCount);
      imageCount.data.push(obj.imageCount);
      voiceCount.data.push(obj.voiceCount);
    });
    data.datasets.push(broadcastTypeCount);
    data.datasets.push(mesaageTypeCount);
    data.datasets.push(shiftTypeCount);
    data.datasets.push(takeoffApprove);
    data.datasets.push(takeoffTypeCount);
    data.datasets.push(textCount);
    data.datasets.push(videoCount);
    data.datasets.push(imageCount);
    data.datasets.push(voiceCount);

    return this.getChart(this.lineCanvas.nativeElement, "line", data);
  }
  getLineChart2() {
    var data = {
      labels: [],
      datasets: []
    };
    let Parent = (label)=> {
      let color1 = this.getColor();
      let color2 = this.getColor();
      let color3 = this.getColor();
      let data = {
        fill: false,
        lineTension: 0.1,
        backgroundColor: color3,
        borderWidth: 1,
        borderColor: color1,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: color1,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color1,
        pointHoverBorderColor: color2,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        label: label,
        data: [],
        spanGaps: false,
      }
      return data;
    }
    let mileageCount = Parent('里程(km)'),
        speedCount = Parent('速度(km/h)');
    this.resultData.forEach((obj) => {
      let x;
      if (this.parmObj.timetype == 'day') {
        x = Utils.dateFormat(new Date(obj._id), 'MM/dd');
      } else if (this.parmObj.timetype == 'week') {
        x = obj._id + '周';
      } else if (this.parmObj.timetype == 'month') {
        x = obj._id + '月';
      }

      data.labels.push(x);
      let lcs=obj.pathlength/1000;
      mileageCount.data.push(lcs);
  
      speedCount.data.push(obj.averageSpeed);
    });
    data.datasets.push(mileageCount);
    data.datasets.push(speedCount);
    return this.getChart(this.lineCanvas.nativeElement, "line", data);
  }

   getPieChart(res) {//饼图
    let data1 = {
      labels: ["男", "女", "保密"],
      datasets: [
        {
          data: [res.malecount, res.femalecount, res.unknownSexCount],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
        }]
    };
    let data2 = {
      labels: ["18~35岁", "35~50岁", "50~60岁"],
      datasets: [
        {
          data: [res.youngcount, res.middlecount, res.oldcount],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
        }]
    };
    let data3 = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: []
        }]
    }; 
     this.getChart(this.pieCanvas1.nativeElement, "pie", data1);
     this.getChart(this.pieCanvas2.nativeElement, "pie", data2);
     
     if(res.titlescount){
        let num=0;
        let num1=0;
        let arr=res.titlescount;
        for(let id in arr){ 
          if(id=='notitle'){
              data3.labels.push('无职务');
              data3.datasets[0].data.push(arr[id]);
              let colors=this.getColor();
              data3.datasets[0].backgroundColor.push(colors);
              data3.datasets[0].hoverBackgroundColor.push(colors);
          }else {
            num++;
            this.httpService.post('personadminroute/getpersontitle', {title:id}).subscribe(data => {
              let reslt = data.json();
              num1++;
                if (reslt.error) {
                }else{
                  data3.labels.push(reslt.success.name);
                  data3.datasets[0].data.push(arr[id]); 
                  let colors=this.getColor();
                  data3.datasets[0].backgroundColor.push(colors);
                  data3.datasets[0].hoverBackgroundColor.push(colors);
                }
                if(num==num1){
                  this.getChart(this.pieCanvas3.nativeElement, "pie", data3);
                }
            }, err => {  });
          }
          
        } 
     }
  }
}


