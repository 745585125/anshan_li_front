import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(this.validateForm.valid) {
      const { username, password } = this.validateForm.getRawValue();
      const body = {
        username,
        password
      };
      this._service.login(body)
        .subscribe((res: any) => {
          if(res.code === '0') {
            this.notice.success('登录成功', '跳转至主页');
            this.router.navigateByUrl('/');
          }
        })
    }
  }

  constructor(private fb: FormBuilder, private _service: LoginService, private notice: NzNotificationService, private router: Router) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  public register(): void {
    this.router.navigateByUrl('/register');
  }
}
