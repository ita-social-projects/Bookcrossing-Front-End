import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  public isSideBarOpened = false;
  public showTableManagement = false;
  public showTimeSpans = false;
  constructor(private router: Router, private routeActive: ActivatedRoute) {}

  public ngOnInit(): void {
    const activeChild = this.routeActive.children.length;
    if (activeChild === 0) {
      this.router.navigate(['dashboard'], { relativeTo: this.routeActive });
    }
  }
  public ngOnDestroy(): void {}
}
