import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {

  isSideBarOpened = false;
  showTableManagement = false;
  constructor(private router: Router, private routeActive: ActivatedRoute) { }

  ngOnInit(): void {
  }
  ngOnDestroy() {
  }
}
