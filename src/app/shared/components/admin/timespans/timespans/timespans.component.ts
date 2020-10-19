import { Component, OnInit, ViewChild } from '@angular/core';
import { ISetting } from 'src/app/core/models/timespans/setting';
import { SettingKey } from 'src/app/core/models/timespans/setting-key.enum';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SettingService } from 'src/app/core/services/setting/setting.service';
import { RefDirective } from 'src/app/shared/directives/ref.derictive';
import { TranslateService } from '@ngx-translate/core';
import { ITimespan } from 'src/app/core/models/timespans/timespan';

@Component({
  selector: 'app-timespans',
  templateUrl: './timespans.component.html',
  styleUrls: ['./timespans.component.scss']
})
export class TimespansComponent implements OnInit {
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;
  settings: ISetting[] = [];

  public constructor(
    private dialogService: DialogService,
    private settingService: SettingService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }
  public ngOnInit(): void {
    this.setSetting();
  }

  public changeTimeSpan(item: ISetting) {
    this.dialogService.openTimespanDialog(item);
  }

  public setSetting() {
    this.getSetting(SettingKey.RequestAutoCancelTimespan,
      'components.admin.timespans.request.autocancel',
      'components.admin.timespans.request.description');
    this.getSetting(SettingKey.RequestAutoCancelRemindTimespan,
      'components.admin.timespans.reminder.forUser',
      'components.admin.timespans.reminder.description');
  }

  public getSetting(key: SettingKey, name: string, description: string): void {
    this.settingService.getSettingByKey(key).subscribe({
      next: (pageData) => {
        pageData.name = name;
        pageData.description = description;
        if (pageData.value === null) {
          pageData.value = pageData.defaultValue;
        }
        const indexObj = this.settingService.sharedSettings.findIndex(x => x.key === pageData.key);
        this.settingService.sharedSettings[indexObj] = pageData;
        this.settings = this.settingService.sharedSettings;
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('common-errors.error-message'),
          'X'
        );
      },
    });
  }

  public resetTimeSpan(item: ISetting) {
    let requstTimespan: ITimespan;
    let remindTimespan: ITimespan;

    if (item.key === SettingKey.RequestAutoCancelTimespan) {
       requstTimespan = this.settingService.getTimeSpan(item.defaultValue);
       remindTimespan = this.settingService.getTimeSpan(
         this.settingService.sharedSettings.find(x => x.key !== item.key).value);
    } else {
      requstTimespan = this.settingService.getTimeSpan(
        this.settingService.sharedSettings.find(x => x.key !== item.key).value);
      remindTimespan = this.settingService.getTimeSpan(item.defaultValue);
    }

    const isRequestAbRemind = this.settingService.isRequestGreaterRemind(requstTimespan, remindTimespan);
    if (!isRequestAbRemind) {
      this.notificationService.error(
        this.translate.instant('components.admin.timespans.error-changed'),
        'X'
      );
      return;
    }

    this.editSetting(item, item.defaultValue);
  }

  public editSetting(item: ISetting, timespan: string) {
    const oldTime = item.value;
    if (oldTime === timespan) {
      return;
    }
    item.value = timespan;
    this.settingService.editSetting(item).subscribe({
      next: () => {
        this.notificationService.success(
          this.translate.instant('components.admin.timespans.successfully-changed', {name : this.translate.instant(item.name),
            oldTimePeriod: oldTime, newTimePeriod: item.defaultValue}),
          'X'
        );
        const indexObj = this.settingService.sharedSettings.findIndex(x => x.key === item.key);
        this.settingService.sharedSettings[indexObj] = item;
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
