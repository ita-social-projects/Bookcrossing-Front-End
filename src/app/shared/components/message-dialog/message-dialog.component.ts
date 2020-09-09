import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<MessageDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data
    ) { }

  public ngOnInit(): void {
  }

  public sendMessage(msg: string): void {
    this.dialogRef.close(msg);
  }

  public closeDialog(): void {
    this.dialogRef.close(null);
  }
}
