import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ISetting } from 'src/app/core/models/timespans/setting';
import { SettingKey } from 'src/app/core/models/timespans/setting-key.enum';
import { ITimespan } from 'src/app/core/models/timespans/timespan';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SettingService } from 'src/app/core/services/setting/setting.service';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './timespans-popup.component.html',
  styleUrls: ['./timespans-popup.component.scss']
})
export class TimespansPopupComponent implements OnInit {
  public step = 1;
  public thumbLabel = true;

  constructor( public dialogRef: MatDialogRef<TimespansPopupComponent>,
               @Inject(MAT_DIALOG_DATA) public data: ISetting,
               private settingService: SettingService,
               private notificationService: NotificationService,
               private translate: TranslateService,
               private formBuilder: FormBuilder
    ) {
      this.changeTimeSpanForm = this.formBuilder.group({
        minutes: [0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(60),
        ]
      ],
      hours: [0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(24),
        ]
      ],
      days: [0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(30),
        ]
      ],
      });
    }

  changeTimeSpanForm: FormGroup;
  settings: ISetting[];
  timespan: ITimespan = { minutes: 0, hours: 0, days: 0};

  public ngOnInit(): void {
  }

  public get minutes() {
    return this.changeTimeSpanForm.get('minutes');
  }

  public get hours() {
    return this.changeTimeSpanForm.get('hours');
  }

  public get days() {
    return this.changeTimeSpanForm.get('days');
  }





  public setTimeSpan() {
    if (this.changeTimeSpanForm.invalid) {
      return;
    }
    const strTimeSpan: string = this.settingService.sharedSettings.find(x => x.key !== this.data.key).value;
    const timespanToCompare: ITimespan = this.settingService.getTimeSpan(strTimeSpan);
    this.timespan = {days : this.days.value, hours: this.hours.value, minutes: this.minutes.value};

    let isRequestAbRemind = false;
    if (this.data.key === SettingKey.RequestAutoCancelTimespan) {
      isRequestAbRemind = this.settingService.isRequestGreaterRemind(this.timespan, timespanToCompare);
    } else {
      isRequestAbRemind = this.settingService.isRequestGreaterRemind(timespanToCompare, this.timespan);
    }

    if (!isRequestAbRemind) {
      this.notificationService.error(
        this.translate.instant('components.admin.timespans.error-changed'),
        'X'
      );
      return;
    }


    const hours = this.timespan.hours < 10 ? '0' + this.timespan.hours : this.timespan.hours;
    const minutes = this.timespan.minutes < 10 ? '0' + this.timespan.minutes : this.timespan.minutes;
    const timeSpan = this.timespan.days + '.' + hours + ':' + minutes + ':00';
    this.editTimeSpan(timeSpan);
  }

  public editTimeSpan(timeSpan: string) {
    if (timeSpan === this.data.value) {
      return;
    }
    const setting = {...this.data, value: timeSpan};
    this.dialogRef.close(true);
    this.settingService.editSetting(setting).subscribe({
      next: () => {
        this.notificationService.success(
          this.translate.instant('components.admin.timespans.successfully-changed', {name : this.translate.instant(setting.name),
            oldTimePeriod: this.data.value, newTimePeriod: timeSpan}),
          'X'
        );

        const indexObj = this.settingService.sharedSettings.findIndex(x => x.key === setting.key);
        this.settingService.sharedSettings[indexObj] = setting;
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('common-errors.error-message'),
          'X'
        );
      },
    });
  }
}
