import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-regisger',
  templateUrl: './regisger.component.html',
  styleUrls: ['./regisger.component.scss'],
})
export class RegisgerComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const { username, password } = this.validateForm.getRawValue();
      const body = {
        username,
        password,
      };
      this._service.register(body).subscribe((res: any) => {
        if (res.msg === 'success') {
          this.notice.success('注册成功', '将跳转至主页');
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(
    private fb: FormBuilder,
    private _service: RegisterService,
    private router: Router,
    private notice: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }
}
