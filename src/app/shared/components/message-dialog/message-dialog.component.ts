import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialogService: DialogService,
              private translate: TranslateService,
  ) { }

  public ngOnInit(): void {
  }

  public sendMessage(msg: string): void {
    this.dialogRef.close(msg);
  }

  public async closeDialog(): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get(this.translate.instant('components.profile.edit.cancelDialog')).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.dialogRef.close(null);
        }
      });
  }
}
