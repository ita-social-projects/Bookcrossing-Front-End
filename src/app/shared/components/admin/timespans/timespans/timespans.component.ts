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
  isClicked = false;
  isOpened = false;
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

  public resetTimeSpan(item: ISetting) {
    let requstTimespan: ITimespan;
    let remindTimespan: ITimespan;

    if (item.key === SettingKey.RequestAutoCancelTimespan) {
       requstTimespan = this.settingService.getTimeSpan(item.defaultValue);
       remindTimespan = this.settingService.getTimeSpan(this.settingService.sharedSettings[1].value);
    } else {
      requstTimespan = this.settingService.getTimeSpan(this.settingService.sharedSettings[0].value);
      remindTimespan = this.settingService.getTimeSpan(item.defaultValue);
    }
    const isRequestAbRemind = this.CompareTimespans(requstTimespan, remindTimespan);
    if (!isRequestAbRemind) {
      return;
    }

    this.editSetting(item);
  }

  public editSetting(item: ISetting) {
    const oldTimePeriaod = item.value;
    item.value = item.defaultValue;
    this.settingService.editSetting(item).subscribe({
      next: () => {
        this.notificationService.success(
          `You have successfully changed the time period for '
          ${item.name}  ' from [${oldTimePeriaod}] to [${item.defaultValue}]`,
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

  public CompareTimespans(request: ITimespan, remind: ITimespan): boolean {
    if (request.days > remind.days ||
    request.days === remind.days && request.hours > request.hours ||
    request.days === remind.days && request.hours === request.hours && request.minutes > remind.minutes) {
      return true;
    } else {
      this.notificationService.error(
        'Timespan for reminding must be less than timespan for autocancel',
        'X'
      );
      return false;
    }
  }

  public setSetting() {
    this.getSetting(SettingKey.RequestAutoCancelTimespan, 'Request Autocancel');
    this.getSetting(SettingKey.RequestAutoCancelRemindTimespan, 'Reminder for user');
  }

  public getSetting(key: SettingKey, name: string): void {
    this.settingService.getSettingByKey(key).subscribe({
      next: (pageData) => {
        pageData.name = name;
        if (pageData.value === null) {
          pageData.value = pageData.defaultValue;
        }
        const indexObj = this.settingService.sharedSettings.findIndex(x => x.key === pageData.key);
        this.settingService.sharedSettings[indexObj] = pageData;
        this.settingService.sharedSettings[indexObj].name = name;
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
}
