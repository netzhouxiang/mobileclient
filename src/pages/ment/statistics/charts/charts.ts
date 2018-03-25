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
  @ViewChild('barCanvas6') barCanvas6;
  @ViewChild('pieCanvas6') pieCanvas6;
  @ViewChild('barCanvas7') barCanvas7;
  @ViewChild('pieCanvas7') pieCanvas7;
  
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
      }else if(this.parmObj.getRadioType == 6){
        this.pageTitle = '人员设施统计';
        this.tongjiname='人员设施统计';
        this.getbarChart6();
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
    console.log(res)
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
    console.log(data1)
     this.getChart(this.pieCanvas1.nativeElement, "pie", data1);
     this.getChart(this.pieCanvas2.nativeElement, "pie", data2);
     for (let idx in res.roles){
        data3.labels.push(res.roles[idx].role_name);
        data3.datasets[0].data.push(res.roles[idx].num); 
        let colors=this.getColor();
        data3.datasets[0].backgroundColor.push(colors);
        data3.datasets[0].hoverBackgroundColor.push(colors);
     }
     this.getChart(this.pieCanvas3.nativeElement, "pie", data3);
  }
  getbarChart6(res?) {
    
    var randomScalingFactor=function(){return Math.floor(Math.random()*150);}
    console.log(this.resultData)
    let data1 = {
      labels: this.resultData.biao1.class,
      datasets: [{
        label: this.resultData.biao1.aa[0],
        backgroundColor: this.getColor(),
        data: this.resultData.biao1.a1
      }, {
        label: this.resultData.biao1.aa[1],
        backgroundColor: this.getColor(),
        data: this.resultData.biao1.a2
      }, {
        label: this.resultData.biao1.aa[2],
        backgroundColor: this.getColor(),
        data: this.resultData.biao1.a3
      }, {
        label: this.resultData.biao1.aa[3],
        backgroundColor: this.getColor(),
        data: this.resultData.biao1.a4
      }]
    }
    let data2 = {
      labels: this.resultData.biao2.class,
      datasets: [{
        label: this.resultData.biao2.aa[0],
        backgroundColor: this.getColor(),
        data: this.resultData.biao2.a1
      }, {
        label: this.resultData.biao2.aa[1],
        backgroundColor: this.getColor(),
        data: this.resultData.biao2.a2
      }, {
        label: this.resultData.biao2.aa[2],
        backgroundColor: this.getColor(),
        data: this.resultData.biao2.a3
      }, {
        label: this.resultData.biao2.aa[3],
        backgroundColor: this.getColor(),
        data: this.resultData.biao2.a4
      }]
    }
    this.getChart(this.barCanvas6.nativeElement, "bar", data1,{
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      }
    });
    this.getChart(this.barCanvas7.nativeElement, "bar", data2,{
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      }
    });
    this.httpService.post('statistics/mongoarea').subscribe(data => {
      console.log('获取所在区域的统计')
      var res = data.json();
      if(res.code==200){
        var datavalue1={name:[],data:[],color:[]};
        var datavalue2={name:[],data:[],color:[]};
        res.info.list[0].forEach(element => {
            datavalue1.name.push(element.name)
            datavalue1.data.push(element.lenth)
            datavalue1.color.push(this.getColor())
          });
          res.info.list[1].forEach(element => {
            datavalue2.name.push(element.name)
            datavalue2.data.push(element.lenth)
            datavalue2.color.push(this.getColor())
          });
          
        var xldata=function(xl){
          var arr=[];
          xl.forEach(element => {
            arr.push(element.lenth)
          });
          return arr;
        }
    console.log(res) //饼图
    let data1 = {
      labels:datavalue1.name,
      datasets: [
        {
          data:datavalue1.data,
          backgroundColor: datavalue1.color,
          hoverBackgroundColor: datavalue1.color
        }]
    };
    let data2 = {
      labels:datavalue2.name,
      datasets: [
        {
          data:datavalue2.data,
          backgroundColor: datavalue2.color,
          hoverBackgroundColor:datavalue2.color
        }]
    };
    console.log(data1)
     this.getChart(this.pieCanvas6.nativeElement, "pie", data1);
     this.getChart(this.pieCanvas7.nativeElement, "pie", data2);
  
      }
      console.log(res)
    })
  }
}


