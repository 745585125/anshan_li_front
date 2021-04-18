import { NgModule } from '@angular/core';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import {
  NgZorroAntdModule,
  NzButtonModule,
  NzFormModule,
  NzInputModule,
  NzLayoutModule,
  NzMenuModule,
} from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';

const NZ_MODULES = [
  IconsProviderModule,
  // NzLayoutModule,
  // NzMenuModule,
  // NzFormModule,
  // NzInputModule,
  ReactiveFormsModule,
  // NzButtonModule,
  NgZorroAntdModule
];

@NgModule({
  declarations: [],
  imports: [...NZ_MODULES],
  exports: [...NZ_MODULES],
})
export class SharedModule {}
