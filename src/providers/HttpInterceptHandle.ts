/**
 * 自定义http拦截器
 * @2017-5-8
 */
import {Events} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {NativeService} from "./NativeService";

@Injectable()
export class HttpInterceptHandle {
  constructor(public events: Events, public nativeService: NativeService) {
    events.subscribe('request:before', (body, options) => {//请求前拦截处理
      if(!nativeService.getParam('hideloading',body)){//是否显示loading
         nativeService.showLoading();
      }
       console.log('%c 请求前 %c', 'color:blue', '', 'url', body, 'options', options);
    });

    events.subscribe('request:success', (body, options, res) => {//请求成功拦截处理
       nativeService.hideLoading();
       if(!nativeService.getParam('nochecklogin',body)){//是否检查登录
        
      }
      console.log('%c 请求成功 %c', 'color:green', '', 'url', body, 'options', options, 'res', res);
    });

    events.subscribe('request:error', (body, options, error) => {//请求失败拦截处理
      console.log('%c 请求失败 %c', 'color:red', '', 'url', body, 'options', options, 'error', error);
      nativeService.hideLoading();
      let status = error.status;
      if (status === 0) {
        nativeService.showToast('请求响应错误，请检查网络');
      } else if (status === 404) {
        nativeService.showToast('请求链接不存在，请联系管理员');
      } else if (status === 500) {
        nativeService.showToast('服务器忙，请稍后再试');
      } else {
        nativeService.showToast('响应超时，请稍候再试');
      }
    });
  }

}