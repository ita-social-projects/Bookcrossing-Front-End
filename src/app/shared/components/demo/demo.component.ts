import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  openLocationPopup(){
    this.dialogService.openLocationDialog(null);
  }
}
