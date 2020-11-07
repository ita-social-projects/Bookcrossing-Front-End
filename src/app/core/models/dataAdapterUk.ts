import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { StringDecoder } from 'string_decoder';

@Injectable()
export class UkDataAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
      return this.locale === 'en' ? 0 : 1;
    }
    parse(dateString: string): Date | null {
      if ((this.locale === 'en') && (dateString.indexOf('/') > -1)) {
        const splittedDate = dateString.split('/');
        const year = Number(splittedDate[0]);
        const month = Number(splittedDate[1]) - 1;
        const day = Number(splittedDate[2]);
        return new Date(day, month, year);
      } else if ((this.locale === 'ua') && (dateString.indexOf('.') > -1)) {
        const splittedDate = dateString.split('.');
        const year = Number(splittedDate[0]);
        const month = Number(splittedDate[1]) - 1;
        const day = Number(splittedDate[2]);
        return new Date(day, month, year);
      }

      const timestamp = typeof dateString === 'number' ? dateString : Date.parse(dateString);
      return isNaN(timestamp) ? null : new Date(timestamp);
    }

     format(date: Date, displayFormat): string {
         if (displayFormat === 'input') {
             const day = date.getDate();
             const month = date.getMonth() + 1;
             const year = date.getFullYear();
             return this.locale === 'en' ? this.format_en(day, month, year) : this.format_ua(day, month, year);
         } else {
             return date.toDateString();
         }
     }

     private _to2digit(n: number) {
         return ('00' + n).slice(-2);
     }

     private format_en(day: number, month: number, year: number): string {
       return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
     }

     private format_ua(day: number, month: number, year: number): string {
      return this._to2digit(day) + '.' + this._to2digit(month) + '.' + year;
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
