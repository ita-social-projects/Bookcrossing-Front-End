import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DonateDialogComponent } from '../../../shared/components/donate-dialog/donate-dialog.component';
import { LocationPopupComponent } from 'src/app/shared/components/location-popup/location-popup.component';
import { IUserInfo } from 'src/app/core/models/userInfo';
import { MessageDialogComponent } from 'src/app/shared/components/message-dialog/message-dialog.component';
import { HomeLocationPickerComponent } from 'src/app/shared/components/home-location-picker/home-location-picker.component';
import { TimespansPopupComponent } from 'src/app/shared/components/admin/timespans-popup/timespans-popup.component';
import { ISetting } from '../../models/timespans/setting';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  public openConfirmDialog(msg): MatDialogRef<ConfirmDialogComponent, any> {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
  public openDonateDialog(msg): MatDialogRef<DonateDialogComponent, any> {
    return this.dialog.open(DonateDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
  public openFormDialog(formComponent): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.panelClass = 'form';
    this.dialog.open(formComponent, dialogConfig);
  }

  public openLocationDialog(
    user: IUserInfo
  ): MatDialogRef<LocationPopupComponent> {
    return this.dialog.open(LocationPopupComponent, {
      ariaLabelledBy: '#locationPopupTitle',
      minWidth: '600px',
      maxWidth: '600px',
      maxHeight: '95%',
      data: user,
    });
  }

  public openHomeLocationDialog(
    userId: number
  ): MatDialogRef<HomeLocationPickerComponent> {
    return this.dialog.open(HomeLocationPickerComponent, {
      minWidth: '1100px',
      maxWidth: '1100px',
      data: userId,
    });
  }

  public closeDialogs(): void {
    this.dialog.closeAll();
  }

  public openMessageDialog(name: string) {
    return this.dialog.open(MessageDialogComponent, {
      width: '50%',
      disableClose: true,
      data: {
        to: name
      },
    });
  }

  public openTimespanDialog(timespan: ISetting) {
    return this.dialog.open(TimespansPopupComponent, {
      width: '40%',
      disableClose: true,
      data: timespan
    });
  }
}
