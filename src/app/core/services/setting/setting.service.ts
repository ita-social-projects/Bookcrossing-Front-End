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

    public getTimeSpan(format: string): ITimespan {
      const tokens = format.split(':');
      const timeSpan = {
        days: +tokens[0],
        hours: +tokens[1],
        minutes: +tokens[2]
      };
      return timeSpan;
    }
  }
