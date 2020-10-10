import { SettingKey } from './setting-key.enum';

export interface ISetting {
    value?: string;
    key: SettingKey;
    name?: string;
    defaultValue?: string;
    description?: string;
  }
