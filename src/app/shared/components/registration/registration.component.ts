import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private router: Router) {
  }

  navigateToSingIn() {
    this.router.navigate(['/login']);
  }

  comparePasswords(a: string, b: string) {
    return a === b;
  }


  ngOnInit(): void {
  }

}
