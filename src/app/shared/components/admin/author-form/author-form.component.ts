import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { IAuthor } from 'src/app/core/models/author';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorService } from 'src/app/core/services/author/authors.service';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.scss']
})
export class AuthorFormComponent implements OnInit {

@Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
@Input() author: IAuthor;
form: FormGroup;
title = 'Add Author';

  constructor(private authorService: AuthorService, ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      id : new FormControl({value: this.author.id, disabled: true}),
      firstName : new FormControl(this.author.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('^([a-zA-Z \'-]+)$')]),
      lastName : new FormControl(this.author.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('^([a-zA-Z \'-]+)$')]),
      middleName : new FormControl(this.author.middleName, [
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern('^([a-zA-Z \'-]+)$')]),
    });
  }

  submit(): void {
    const newAuthor: IAuthor = {
      id: this.form.get('id').value,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      middleName: this.form.get('middleName').value
    };
    this.updateAuthor(newAuthor);
  }

  cancel(): void {
    this.onCancel.emit();
    this.form.reset();
  }

  updateAuthor(author: IAuthor) {
    this.authorService.updateAuthor(author).subscribe(
      (data: IAuthor) => {
        alert('Changes accepted');
        this.authorService.editAuthor(author);
        this.cancel();
      },
      (error) => {
        alert(error.message);
      },
    );
  }
}
