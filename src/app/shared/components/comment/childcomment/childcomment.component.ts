import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {IUser} from '../../../../core/models/user';
import {CommentService} from '../../../../core/services/commment/comment.service';

@Component({
  selector: 'app-childcomment',
  templateUrl: './childcomment.component.html',
  styleUrls: ['./childcomment.component.scss'],
  template: `
    <app-childcomment [comments]="comments" [level]="level" [user]="user"></app-childcomment>`
})
export class ChildcommentComponent implements OnInit {
  @Input() comments;
  @Input() level;
  @Input() user: IUser;
  @Input() ids;
  @Output() update = new EventEmitter();
  @Input() isAuthorized;
  text = '';


  UpdateComments() {
    this.update.next();
  }
  increment() {
    return this.level++;
  }

  constructor(private  commentservice: CommentService) {
  }

  ngOnInit(): void {

  }

  formatDate(date) {

    TimeAgo.addLocale(en);
    const d = new Date(date);
    const timeAgo = new TimeAgo('en-US');
    return timeAgo.format(d);
  }

  CanEditCommnet(owner) {
    if (owner === null || this.user === null) {
      return false;
    } else {
      return owner.id === this.user.id;
    }
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
  canCommit() {
    return this.isAuthorized && (this.text !== '');
  }
  returnID(id) {
    let newids = this.ids.slice();
    newids.push(id);
    return newids;
  }

  async deleateComment(id) {
    let newids = this.returnID(id);

    this.commentservice.deleteChildComment(newids, this.user.id).subscribe((r) => {
    });
    this.UpdateComments();
  }

  updateComment(id, text) {
    let newids = this.returnID(id);
    this.commentservice.updateChildComment(newids, text, this.user.id).subscribe((r) => {
    });
    this.UpdateComments();
  }

  PostComment() {
    this.commentservice.postChildComment(this.ids, this.text, this.user.id).subscribe((r) => {

    });
    this.text = '';
    this.UpdateComments();
  }
}
