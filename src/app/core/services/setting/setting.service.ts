import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settingUrl } from 'src/app/configs/api-endpoint.constants';
import { Observable } from 'rxjs';
import { ISetting } from '../../models/timespans/setting';
import { SettingKey } from '../../models/timespans/setting-key.enum';
import { ITimespan } from '../../models/timespans/timespan';

@Injectable({
    providedIn: 'root'
  })
  export class SettingService {
    constructor(
    private http: HttpClient
    ) { }

    public sharedSettings: ISetting[] = [
      {key: SettingKey.RequestAutoCancelTimespan},
      {key: SettingKey.RequestAutoCancelRemindTimespan}
    ];

    public editSetting(setting: ISetting) {
      return this.http.put(settingUrl + '/' + setting.key, setting);
    }

    public getSettingByKey(key: SettingKey): Observable<ISetting> {
      return this.http.get<ISetting>(settingUrl + '/' + key);
    }

    public isRequestGreaterRemind(request: ITimespan, remind: ITimespan): boolean {

      return request.days > remind.days ||
        request.days === remind.days && request.hours > request.hours ||
        request.days === remind.days && request.hours === request.hours && request.minutes > remind.minutes;
    }

    public getTimeSpan(strTimeSpan: string): ITimespan {
      const times = strTimeSpan.split(/[:.]/);
      const timeSpan = {
        days: +times[0],
        hours: +times[1],
        minutes: +times[2]
      };
      return timeSpan;
    }
  }
