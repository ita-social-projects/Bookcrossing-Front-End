import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";

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
      position: { top: "10px" },
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

  closeDialogs() {
    this.dialog.closeAll();
  }
}
