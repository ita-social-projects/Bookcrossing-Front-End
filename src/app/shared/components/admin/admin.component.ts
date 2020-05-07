import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {

  isSideBarOpened = false;
  showTableManagement = true;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnDestroy() {
  }
}
