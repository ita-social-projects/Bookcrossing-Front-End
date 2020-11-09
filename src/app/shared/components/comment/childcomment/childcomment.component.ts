import {Component, Input, OnInit, EventEmitter, Output, Renderer2, HostListener, ViewChildren, QueryList} from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import uk from 'javascript-time-ago/locale/uk';
import {IUserInfo} from '../../../../core/models/userInfo';
import {CommentService} from '../../../../core/services/commment/comment.service';
import {IChildDeleteComment} from '../../../../core/models/comments/child-comment/childDelete';
import {IChildUpdateComment} from '../../../../core/models/comments/child-comment/childUpdate';
import {IChildInsertComment} from '../../../../core/models/comments/child-comment/childInsert';
import {DialogService} from '../../../../core/services/dialog/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {IRootDeleteComment} from '../../../../core/models/comments/root-comment/rootDelete';
import {IBookOwner} from '../../../../core/models/comments/owner';
import {AuthenticationService} from '../../../../core/services/authentication/authentication.service';


@Component({
  selector: 'app-childcomment',
  templateUrl: './childcomment.component.html',
  styleUrls: ['./childcomment.component.scss']
})
export class ChildcommentComponent implements OnInit {
  @ViewChildren('childComment') subcomments: QueryList<ChildcommentComponent>;
  @Input() comments;
  @Input() level;
  @Input() user: IUserInfo;
  @Input() ids;
  @Output() update = new EventEmitter();
  @Input() isAuthorized;
  @Input() root;
  text = '';
  hideErrorInterval: NodeJS.Timeout;
  lastUpdatedArea: HTMLTextAreaElement;


  UpdateComments() {
    this.update.next();
  }
  increment() {
    return this.level++;
  }

  constructor(private commentservice: CommentService,
              private dialogService: DialogService,
              private translate: TranslateService,
              private renderer: Renderer2,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {

  }

  public formatDate(date: Date): string {
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

  CanEditCommnet(owner) {
    if (owner === null || this.user === null) {
      return false;
    } else {
      return owner.id === this.user.id;
    }
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
    const newids = this.ids.slice();
    newids.push(id);
    return newids;
  }

  public async onDeleteComment(id: string): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('Do you want to delete the comment?').toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          const newids = this.returnID(id);
          const deleteComment: IChildDeleteComment = {
            ids: newids, ownerId: this.user.id
          };
          this.commentservice.deleteChildComment(deleteComment).subscribe(() => this.UpdateComments());
        }
      });
  }

  public updateComment(id, text): void {
    const newids = this.returnID(id);
    const updateComment: IChildUpdateComment = {
      ids: newids, ownerId: this.user.id, text
    };
    this.commentservice.updateChildComment(updateComment).subscribe(() => this.UpdateComments());
  }

  public PostComment(text: string, ids: string[]): void {
    const postComment: IChildInsertComment = {
      ids, ownerId: this.user.id, text
    };
    this.commentservice.postChildComment(postComment).subscribe(() => this.UpdateComments());
    this.text = '';
  }

  public onCommentInput(input: HTMLTextAreaElement, maxLength: number): void {
    this.lastUpdatedArea = input;
    if (input.value.length <= maxLength) {
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

    input.classList.add('invalid');
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
    if (this.text !== '') {
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

  public isEn(): boolean {
    return this.translate.currentLang === 'en';
  }
}
