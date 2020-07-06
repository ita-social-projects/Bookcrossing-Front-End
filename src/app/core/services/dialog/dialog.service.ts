import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import {DonateDialogComponent} from '../../../shared/components/donate-dialog/donate-dialog.component';
import { LocationPopupComponent } from 'src/app/shared/components/location-popup/location-popup.component';
import { IUser } from 'src/app/core/models/user';

@Injectable({
  providedIn: "root"
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog(msg) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: "390px",
      panelClass: "confirm-dialog-container",
      disableClose: true,
      data: {
        message: msg
      }
    });
  }
  openDonateDialog(msg) {
    return this.dialog.open(DonateDialogComponent, {
      width: "390px",
      panelClass: "confirm-dialog-container",
      disableClose: true,
      data: {
        message: msg
      }
    });
  }
  openFormDialog(formComponent) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.panelClass = "form";
    this.dialog.open(formComponent, dialogConfig);
  }

  openLocationDialog(user: IUser): MatDialogRef<LocationPopupComponent>{
    return this.dialog.open(LocationPopupComponent,{
      data: user
    })
  }

  closeDialogs() {
    this.dialog.closeAll();
  }
}
