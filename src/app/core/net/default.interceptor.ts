import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
const CODEMESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector) { }

  public get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  public get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用
        if (event instanceof HttpResponse) {
            const body: any = event.body;
            if (body && body.code !== '0') {
                this.msg.error(body.msg);
                // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
                // this.http.get('/').subscribe() 并不会触发
                return throwError({});
            } else {
                // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
                // return of(new HttpResponse(Object.assign(event, { body: body.data })));
                // 或者依然保持完整的格式
                return of(event);
            }
        }
        break;
      case 400: // 参数错误
        if (event instanceof HttpErrorResponse) {
          if (event.error) {
            this.notification.error('请求错误', event.error.message);
          }
        }
        break;
      case 401: // 未登录状态码
        this.goTo('/login');
        break;
      case 403:
      case 404:
      case 500:
        // forbidden force redirect to error page temporarily.
        const errorEvent: any = event;
        if (errorEvent.error.message) {
          this.notification.error('网络错误', `${errorEvent.error.message}`);
        } else {
          this.notification.error('网络错误', `${event.status}: ${errorEvent.url}`);
        }
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          // console.warn(
          //   '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
          //   event,
          // );
          this.msg.error(event.message);
        }
        break;
    }
    return of(event);
  }

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<| HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    // socket不走该拦截器
    if (!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('./assets/')) {
      url = environment.SERVER_URL + url;
    }
    const newReq = req.clone({
      url,
      setParams: {
        // role,
        // emplId,
        // emplCode,
        // emplName,
      }
    });
    return next.handle(newReq)
      .pipe(
        mergeMap((event: any) => {
          // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
          if (event instanceof HttpResponse && event.status === 200) {
            return this.handleData(event);
          }
          // 若一切都正常，则后续操作
          return of(event);
        }),
        catchError((err: HttpErrorResponse) => {
          this.handleData(err);
          // 返回错误处理
          return throwError(err);
        }),
      );
  }
}
