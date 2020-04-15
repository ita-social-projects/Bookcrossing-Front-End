import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { IAuthor } from "src/app/core/models/author";
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.scss']
})
export class AuthorFormComponent implements OnInit {

@Output() onAction : EventEmitter<IAuthor> = new EventEmitter<IAuthor>()
@Output() onCancel : EventEmitter<void> = new EventEmitter<void>()
@Input() author : IAuthor
form: FormGroup
title : string = "Add Author";

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      id : new FormControl({value:this.author.id, disabled: true}),
      firstName : new FormControl(this.author.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern("^([a-zA-Z '-]+)$")]),
      lastName : new FormControl(this.author.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern("^([a-zA-Z '-]+)$")]),
      middleName : new FormControl(this.author.middleName, [
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern("^([a-zA-Z '-]+)$")]),
    });
  }

  submit(): void {
    const newAuthor: IAuthor = {
      id: this.form.get('id').value,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      middleName: this.form.get('middleName').value
    };
    this.onAction.emit(newAuthor);
    this.cancel();
  };

  cancel(): void {
    this.onCancel.emit();
  }
}
