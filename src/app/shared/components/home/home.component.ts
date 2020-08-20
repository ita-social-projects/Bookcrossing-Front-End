import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import { AphorismService } from 'src/app/core/services/aphorism/aphorism.service';
import { IAphorism } from 'src/app/core/models/aphorism';
import { ActivatedRoute, Params } from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  aphorism: IAphorism;
  isCurrent = true;

  constructor(
    private authentication: AuthenticationService,
    private aphorismService: AphorismService
    ) { }

  ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.aphorismService.getAphorism(this.isCurrent).subscribe((data: IAphorism) => this.aphorism = data);
  }

  public isAuthenticated(): boolean {
    return this.authentication.isAuthenticated();
  }

  redirectToLogin() {
    this.authentication.redirectToLogin();
  }
}
