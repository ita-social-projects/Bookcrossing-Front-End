import {Component, OnInit, Input, Renderer2, HostListener, ViewChildren, QueryList, ViewChild} from '@angular/core';
import {CommentService} from 'src/app/core/services/commment/comment.service';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import uk from 'javascript-time-ago/locale/uk';
import {IUserInfo} from '../../../core/models/userInfo';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import {UserService} from '../../../core/services/user/user.service';
import {IRootComment} from '../../../core/models/comments/root-comment/root';
import {IRootInsertComment} from '../../../core/models/comments/root-comment/rootInsert';
import {IRootDeleteComment} from '../../../core/models/comments/root-comment/rootDelete';
import {IRootUpdateComment} from '../../../core/models/comments/root-comment/rootUpdate';
import {IChildInsertComment} from '../../../core/models/comments/child-comment/childInsert';
import {DialogService} from '../../../core/services/dialog/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {IBookOwner} from '../../../core/models/comments/owner';
import {ChildcommentComponent} from './childcomment/childcomment.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],

})
export class CommentComponent implements OnInit {
  @ViewChildren('childComment') subcomments: QueryList<ChildcommentComponent>;
  @ViewChild('Comment') mainCommentTextArea;
  @Input() bookId = 0;
  comments: IRootComment[];
  user: IUserInfo;
  text = '';
  updateRating = undefined;
  level = 0;
  hideErrorInterval: NodeJS.Timeout;
  lastUpdatedArea: HTMLTextAreaElement;

  constructor(private commentservice: CommentService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private dialogService: DialogService,
              private translate: TranslateService,
              private renderer: Renderer2) {
  }

  increment() {
    return this.level++;
  }

  ngOnInit() {
    this.UpdateComments();
    this.getUser();
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  private getUser(): void {
    if (this.isAuthenticated()) {
      this.authenticationService.getUserId().subscribe((userId: number) => {
        this.userService.getUserById(userId).subscribe((userInfo: IUserInfo) => {
          this.user = userInfo;
          return;
        });
      });
    }

    this.user = null;
  }

  public canCommit(): boolean {
    return this.isAuthenticated() && (this.text !== '');
  }

  CopyText(text) {
    return text;
  }

  public getUserName(owner): string {
    if (owner === null) {
      return 'deleted user';
    }

    if ((this.user !== null) && (this.user.id === owner.id)) {
      return 'Me';
    }

    return `${owner.firstName} ${owner.lastName}`.trim();
  }

  public getUserInitials(owner): string {
    if (owner === null) {
      return 'deleted user';
    }

    return `${owner.firstName} ${owner.lastName}`.trim();
  }

  public canEditComment(owner: IBookOwner): boolean {
    if (owner === null || this.user === null) {
      return false;
    }

    return owner.id === this.user.id;
  }

  public canDeleteComment(owner: IBookOwner): boolean {
    if (this.authenticationService.isAdmin()) {
      return true;
    }

    if (owner === null || this.user === null) {
      return false;
    }

    return owner.id === this.user.id;
  }

  public formatDate(date) {
    let language = 'uk-Uk';
    TimeAgo.addLocale(uk);
    if (this.isEn()) {
    TimeAgo.addLocale(en);
    language = 'en-Us';
    }
    const d = new Date(date);
    d.setHours(d.getHours());
    const timeAgo = new TimeAgo(language);
    return timeAgo.format(d);
  }

  public returnID(id: number): string[] {
    const ids = [];
    ids.push(id);
    return ids;
  }

  public onCommentAction(): void {
    this.commentservice.fireCommentActionEvent();
  }

  UpdateComments() {
    this.commentservice.getComments(this.bookId).subscribe((value: IRootComment[]) => {
      this.comments = value;
      console.log(value);
      this.comments.sort((a, b) => {
        // @ts-ignore
        return new Date(b.date) - new Date(a.date);
      });
    });
    this.onCommentAction();
  }

  public PostComment(text: string): void {
    const postComment: IRootInsertComment = {
      bookId: this.bookId, ownerId: this.user.id, text
    };
    this.commentservice.postComment(postComment).subscribe(() => this.UpdateComments());
    this.text = '';
    this.onCommentAction();
  }

  public PostChildComment(subcomment: string, ids: string[]): void {
    const postComment: IChildInsertComment = {
      ids, ownerId: this.user.id, text: subcomment
    };

    this.commentservice.postChildComment(postComment).subscribe(() => this.UpdateComments());
    this.onCommentAction();
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

    this.onCommentAction();
  }

  public updateComment(id, text): void {
    const updateComment: IRootUpdateComment = {
      id, ownerId: this.user.id, text
    };
    this.commentservice.updateComment(updateComment).subscribe(() => this.UpdateComments());
    this.onCommentAction();
  }

  onEditRatingSet($event: number) {
    this.updateRating = $event;
  }

  public onCommentInput(input: HTMLTextAreaElement, maxLength: number): void {
    this.lastUpdatedArea = input;

    if (input.textLength <= maxLength) {
      this.changeTextAreaHeight(input);
      return;
    }

    // set values
    input.value = input.value.substr(0, maxLength);
    this.changeTextAreaHeight(input);

    // return if already is shown
    if (this.hideErrorInterval) {
      return;
    }

    input.classList.add('has-error');
    const div = this.renderer.createElement('div');
    this.renderer.addClass(div, 'validation-error');
    div.append(this.translate.instant('common-errors.validation-max-length', {value: maxLength}));
    input.parentElement.appendChild(div);

    this.hideErrorInterval = setTimeout(() => {
      input.classList.remove('invalid');
      input.parentElement.removeChild(div);
      this.hideErrorInterval = null;
    }, 2000);
  }

  public changeTextAreaHeight(input: HTMLTextAreaElement): void {
    if (input.scrollHeight > 0) {
      input.style.height = 'auto';
      input.style.height = `${input.scrollHeight}px`;
    }
  }

  // For handling refreshing and closing page
  @HostListener('window:beforeunload', ['$event'])
  public canLeave(): boolean {

    if (this.mainCommentTextArea.nativeElement.value.trim() !== '') {
      return false;
    }

    let hasUnsavedSub = false;
    this.subcomments.forEach((child) => {
      if (child.canLeave() === false) {
        hasUnsavedSub = true;
      }
    });
    if (hasUnsavedSub) {
      return false;
    }

    if (this.lastUpdatedArea === undefined) {
      return true;
    }

    // Check if edit form
    const editFormOldValue = this.lastUpdatedArea.getAttribute('data-old-value');
    if (editFormOldValue && this.lastUpdatedArea.value !== editFormOldValue) {
      return false;
    }

    // Check if reply form
    if (editFormOldValue === null && this.lastUpdatedArea.textLength > 0) {
      return false;
    }

    return true;
  }

  login() {
    this.authenticationService.redirectToLogin();
  }

  public isEn(): boolean {
    return this.translate.currentLang === 'en';
  }
}
