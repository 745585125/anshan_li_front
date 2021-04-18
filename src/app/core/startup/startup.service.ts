import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(public http: HttpClient) {}

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve) => {
      this.http.get('/user/userInfo').subscribe(
        (res: any) => {
          console.log(res);
        },
        () => {
          resolve(null);
        },
        () => {
          resolve(null);
        }
      );
    });
  }
}
