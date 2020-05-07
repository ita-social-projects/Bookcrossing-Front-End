import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private authentication: AuthenticationService) { }

  ngOnInit(): void {}

  isAuthenticated() {
    return this.authentication.isAuthenticated();
  }

}

