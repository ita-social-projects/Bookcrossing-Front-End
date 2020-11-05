import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class UkDataAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
      return this.locale === 'en' ? 0 : 1;
    }
    parse(value: any): Date | null {
      if ((this.locale === 'en') && (typeof value === 'string') && (value.indexOf('/') > -1)) {
        const str = value.split('/');
        const year = Number(str[0]);
        const month = Number(str[1]) - 1;
        const day = Number(str[2]);
        return new Date(day, month, year);
      } else if ((this.locale === 'ua') && (typeof value === 'string') && (value.indexOf('.') > -1)) {
        const str = value.split('.');
        const year = Number(str[0]);
        const month = Number(str[1]) - 1;
        const day = Number(str[2]);
        return new Date(day, month, year);
      }

      const timestamp = typeof value === 'number' ? value : Date.parse(value);
      return isNaN(timestamp) ? null : new Date(timestamp);
    }

     format(date: Date, displayFormat: Object): string {
         if (displayFormat === 'input') {
             const day = date.getDate();
             const month = date.getMonth() + 1;
             const year = date.getFullYear();
             return this.locale === 'en' ? this._to2digit(day) + '/' + this._to2digit(month) + '/' + year : this._to2digit(day) + '.' + this._to2digit(month) + '.' + year;
             // return year  + '/' + this._to2digit(month) + '/' + this._to2digit(day) ;
         } else {
             return date.toDateString();
         }
     }

     private _to2digit(n: number) {
         return ('00' + n).slice(-2);
     }
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
  },
  display: {
      // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
      dateInput: 'input',
      monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric' },
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};
