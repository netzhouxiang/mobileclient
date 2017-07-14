import { Component, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import { NavController, IonicPage ,NavParams} from 'ionic-angular';
import { Utils } from "../../../../providers/Utils";
@IonicPage()
@Component({
  selector: 'page-charts',
  templateUrl: 'charts.html'
})
export class ChartsPage {
  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;
  resultData:any;
  parmObj:any;
  constructor(public navParams: NavParams,public navCtrl: NavController) {
    this.resultData=navParams.get('resultData');
    this.parmObj=navParams.get('parmObj');
   }

  ionViewDidLoad() {
    if(this.resultData){
      if(this.parmObj.type=='lineChart'){
          this.lineChart = this.getLineChart();
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
  getLineChart() {
     var data = {
      labels: [],
      datasets: []
    };
    let Parent =function(label){
    let color1=  '#'+ Math.floor(Math.random()*0xffffff).toString(16);
    let color2=  '#'+ Math.floor(Math.random()*0xffffff).toString(16);
    let color3=  '#'+ Math.floor(Math.random()*0xffffff).toString(16);
      let data={
          fill: false,
          lineTension: 0.1,
          backgroundColor:color3,
          borderWidth:1,
          borderColor: color1,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor:color1,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color1,
          pointHoverBorderColor: color2,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          label: label,
          data:[],
          spanGaps: false,
      }
      return data;
    } 
    let broadcastTypeCount=Parent('广播'),
    mesaageTypeCount=Parent('工作'),
    shiftTypeCount=Parent('换班'),
    takeoffApprove=Parent('放假'),
    takeoffTypeCount=Parent('请假'),
    textCount=Parent('文本'),
    videoCount=Parent('视频'),
    voiceCount=Parent('音频'),
    imageCount=Parent('图片');
    this.resultData.forEach((obj)=>{
      let x;
        if(this.parmObj.timespan=='day'){
           x= Utils.dateFormat(new Date(obj._id),'MM/dd');
        }else if(this.parmObj.timespan=='week'){
           x= obj._id+'周';
        }else if(this.parmObj.timespan=='month'){
          x= obj._id+'月';
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
}
