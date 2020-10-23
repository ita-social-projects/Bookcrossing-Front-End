import { NativeDateAdapter } from '@angular/material/core';

export class UkDataAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        return this.locale === 'en' ? 0 : 1;
       }
}
