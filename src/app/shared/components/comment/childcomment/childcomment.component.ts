import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {IUser} from '../../../../core/models/user';
import {CommentService} from '../../../../core/services/commment/comment.service';
import {IChildDeleteComment} from '../../../../core/models/comments/child-comment/childDelete';
import {IChildUpdateComment} from '../../../../core/models/comments/child-comment/childUpdate';
import {IChildInsertComment} from '../../../../core/models/comments/child-comment/childInsert';


@Component({
  selector: 'app-childcomment',
  templateUrl: './childcomment.component.html',
  styleUrls: ['./childcomment.component.scss']
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
    let deleteComment: IChildDeleteComment = {
      id: newids, ownerId: this.user.id
    }
    this.commentservice.deleteChildComment(deleteComment).subscribe((r) => {

    });
    this.UpdateComments();
  }

  updateComment(id, text) {
    let newids = this.returnID(id);
    let updateComment: IChildUpdateComment = {
      id: newids, ownerId: this.user.id, text: text
    }
    this.commentservice.updateChildComment(updateComment).subscribe((r) => {

    });
    this.UpdateComments();
  }

  PostComment() {
    let postComment: IChildInsertComment = {
      id: this.ids, ownerId: this.user.id, string: this.text

    }
    this.commentservice.postChildComment(postComment).subscribe((r) => {


    });
    this.text = '';
    this.UpdateComments();
  }
}
