import {Component, OnInit, Input} from '@angular/core';
import {CommentService} from 'src/app/core/services/commment/comment.service';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {IUserInfo} from '../../../core/models/userInfo';
import {__await} from 'tslib';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import {UserService} from '../../../core/services/user/user.service';
import {IRootComment} from '../../../core/models/comments/root-comment/root';
import {IRootInsertComment} from '../../../core/models/comments/root-comment/rootInsert';
import {IRootDeleteComment} from '../../../core/models/comments/root-comment/rootDelete';
import {IRootUpdateComment} from '../../../core/models/comments/root-comment/rootUpdate';
import {element} from 'protractor';
import {IChildInsertComment} from '../../../core/models/comments/child-comment/childInsert';
import {DialogService} from '../../../core/services/dialog/dialog.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],

})
export class CommentComponent implements OnInit {
  @Input() bookId = 0;
  comments: IRootComment[];
  user: IUserInfo;
  text = '';
  rating = 0;
  updateRating = undefined;
  level = 0;

  constructor(private commentservice: CommentService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private dialogService: DialogService,
              private translate: TranslateService) {
  }

  increment() {
    return this.level++;
  }

  ngOnInit() {
    this.UpdateComments();
    this.getUser()
  }

  isAuthenticated(){
    return this.authenticationService.isAuthenticated()
  }

  getUser(){
    if(this.isAuthenticated()){
      this.authenticationService.getUserId().subscribe((value: number)=> {
        this.userService.getUserById(value).subscribe((value: IUserInfo)=>{
          this.user = value;
        })
      })
    }
  }


  canCommit() {
    return this.isAuthenticated() && (this.text !== '');
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
    if (owner === null || typeof this.user === 'undefined') {
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

  UpdateComments() {
    this.commentservice.getComments(this.bookId).subscribe((value: IRootComment[])=> {
      this.comments = value;
      this.comments.sort((a, b) => {
        // @ts-ignore
        return new Date(b.date) - new Date(a.date);
      });
    });
  }

  PostComment() {
    let postComment: IRootInsertComment = {
      bookId: this.bookId, ownerId: this.user.id, rating: this.rating, text: this.text
    }
    this.commentservice.postComment(postComment).subscribe(() => this.UpdateComments());
    this.text = '';
  }

  PostChildComment(ids: string[]) {
    const postComment: IChildInsertComment = {
      ids: ids, ownerId: this.user.id, text: this.text
    };

    this.commentservice.postChildComment(postComment).subscribe(() => this.UpdateComments());
    this.text = '';
  }

  public async onDeleteComment(id): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('Do you want to delete the comment?').toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          const deleteComment: IRootDeleteComment = {
            id, ownerId: this.user.id
          };
          this.commentservice.deleteComment(deleteComment).subscribe(() => this.UpdateComments());
        }
      });
  }

  updateComment(id, text, rating) {
    if(typeof this.updateRating === 'undefined'){
      this.updateRating = rating;
    }
    const updateComment: IRootUpdateComment = {
      id: id, ownerId: this.user.id, rating: this.updateRating, text: text
    };
    this.commentservice.updateComment(updateComment).subscribe(() => this.UpdateComments());
  }

  onRatingSet($event: number) {
    this.rating = $event;
  }
  onEditRatingSet($event: number) {
    this.updateRating = $event;
  }

}
