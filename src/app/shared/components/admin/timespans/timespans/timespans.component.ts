import { Component, OnInit, ViewChild } from '@angular/core';
import { RefDirective } from 'src/app/shared/directives/ref.derictive';

@Component({
  selector: 'app-timespans',
  templateUrl: './timespans.component.html',
  styleUrls: ['./timespans.component.scss']
})
export class TimespansComponent implements OnInit {
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;
  isClicked = false;
  isOpened = false;
  constructor() { }

  ngOnInit(): void {
  }

}
