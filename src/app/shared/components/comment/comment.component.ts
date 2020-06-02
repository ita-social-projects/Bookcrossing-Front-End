import {Component, OnInit, Input} from '@angular/core';
import {CommentService} from 'src/app/core/services/commment/comment.service';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {IUser} from '../../../core/models/user';
import {__await} from 'tslib';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],

})
export class CommentComponent implements OnInit {
  @Input() bookId = 0;
  comments;
  user: IUser = null;
  text = '';
  level = 0;
  isAuthorized;


  constructor(private  commentservice: CommentService,
  ) {
  }

  increment() {
    return this.level++;
  }

  async ngOnInit() {
    await this.updateComments();
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.isAuthorized = (this.user !== null);
  }


  canCommit() {
    return this.isAuthorized && (this.text !== '');
  }

  CopyText(text) {
    return text;
  }


  getUserName(owner) {
    if (owner === null) {
      return 'deleted user';
    } else {
      if ((this.user !== null) && (this.user.id === owner.id)) {
        return 'Me';

      } else {
        return owner.firstName + ' ' + owner.lastName;
      }

    }
  }

  CanEditCommnet(owner) {
    if (owner === null || this.user === null) {
      return false;
    } else {
      return owner.id === this.user.id;
    }
  }

  formatDate(date) {

    TimeAgo.addLocale(en);
    const d = new Date(date);
    const timeAgo = new TimeAgo('en-US');
    return timeAgo.format(d);
  }

  returnID(id) {
    let ids = [];
    ids.push(id);
    return ids;
  }

  async updateComments() {
    console.log('update');
    this.comments = await this.commentservice.getComments(this.bookId);
    this.comments.sort((a, b) => {
      // @ts-ignore
      return new Date(b.date) - new Date(a.date);
    });
  }

  async PostComment() {

    this.commentservice.postComment(this.text, this.bookId, this.user.id).subscribe((r) => {

    });
    this.text = '';
    await this.updateComments();
  }

  async deleateComment(id) {

    this.commentservice.deleteComment(id, this.user.id).subscribe((r) => {
    });
    this.updateComments();
  }

  async updateComment(id, text) {
    this.commentservice.updateComment(id, text, this.user.id).subscribe((r) => {
    });
    this.updateComments();
  }

}
