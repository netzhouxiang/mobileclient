import { Injectable } from '@angular/core';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import { Observable } from "rxjs";
/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LoginService {

  constructor(private httpService: HttpService, public native: NativeService) {

  }
  getUserByUUid(uuid): Observable<Response> {//根据uuid查询用户信息
    let requestInfo = {
      url: "person/getPersonByUUId",
      mobileUUid: uuid,
      hideloading: true
    }
    return Observable.create((observer) => {
      this.httpService.post(requestInfo.url, requestInfo).subscribe(
        data => {
          if (data) {
            observer.error('') ;
          } else {
            let res = data.json()
            observer.next(res);
          }

        },
        err => observer.error(err)
      );
    })
  }
}
