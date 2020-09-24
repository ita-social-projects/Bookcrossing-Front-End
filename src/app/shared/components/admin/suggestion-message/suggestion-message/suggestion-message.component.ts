import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Sort } from '@angular/material/sort';
import * as _ from 'lodash';
import { SuggestionMessageService } from 'src/app/core/services/suggestion-message/suggestion-message.service';
import { ISuggestionMessage } from 'src/app/core/models/suggestion-message/suggestion-message';
import { MessageStatus } from 'src/app/core/models/suggestion-message/messageStatus.enum';
import { RefDirective } from 'src/app/shared/directives/ref.derictive';
import { CompletePaginationParams } from 'src/app/core/models/Pagination/completePaginationParameters';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FilterParameters } from 'src/app/core/models/Pagination/filterParameters';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-suggestion-message',
  templateUrl: './suggestion-message.component.html',
  styleUrls: ['./suggestion-message.component.scss']
})
export class SuggestionMessageComponent implements OnInit {

  @Output() selectedRowsChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() selectedHeaderChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() viewClicked: EventEmitter<any> = new EventEmitter<any>();

  public statusHtml: Map<MessageStatus, string> = new Map([
    [MessageStatus.Read,'<i class="fas fa-lg green-text fa-check-circle"></i>'],
    [MessageStatus.Unread,'<i class="fas fa-lg fa-dot-circle"></i>'],
    [MessageStatus.Declined,'<i class="fas fa-lg red-text fa-times-circle"></i>']      
  ]);

  @ViewChild(RefDirective, { static: false }) refDir: RefDirective;

  public messagesStatusHtml: string[] = [];
  public messages: ISuggestionMessage[] = [];
  public messageDisplayColumns: string[] = [
    '',
     'components.admin.suggestion-message.user',
     'components.admin.suggestion-message.summary',
     'components.admin.suggestion-message.status'
  ];
  public btnReplyTitle: string = 'components.admin.suggestion-message.reply';

  public messageProperties: string[] = [
    'id',
    'user',
    'summary',
    'state',
    'text'
  ];
  public selectedRows: any = [];
  public selectDeselect: boolean = true;
  public isChecked: boolean[] ;
  public queryParams: CompletePaginationParams = new CompletePaginationParams();
  public searchText: string;
  public emailString: string;
  public messageStatus = MessageStatus;
  public searchField = 'summary';
  public totalSize: number;

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private messageService: SuggestionMessageService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
        ? this.queryParams.sort.orderByField
        : 'id';

      this.searchText = this.queryParams?.filters[1]?.value;
      this.queryParams.page =
          this.queryParams.page > this.totalSize
            ? this.totalSize
            : this.queryParams.page;
      this.getMessages(this.queryParams);
      this.messages.forEach(msg => msg.isChecked = false);
    });
  }

  public getMessages(params: CompletePaginationParams): void {
    this.messageService.getMessagePage(params).subscribe({
      next: (pageData) => {
        this.messages = pageData.page;
        this.addStatus();

        if (pageData.totalCount) {
          this.totalSize = pageData.totalCount;
        }
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('common-errors.error-message'),
          'X'
        );
      },
    });
  }

  public addStatus(): void{
    this.messagesStatusHtml=[];
    this.messages.forEach((msg) => {
      this.messagesStatusHtml.push(this.statusHtml.get(msg.state));
      });
  }
  
  public onStatusChanged(status: MessageStatus, message: ISuggestionMessage){

    if(status == this.messages[this.messages.indexOf(message)].state){
      return;
    }
  
    message.state = status;
    this.messageService.editMessage(message).subscribe({
      next: () => {
        this.notificationService.success(
          this.translate.instant('components.admin.suggestion-message.status-changed'),
          'X'
        );
        this.messages[this.messages.indexOf(message)].state = status;
        this.addStatus();
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('common-errors.error-message'),
          'X'
        );
      },
    });
  }

  public search(): void{
    if (this.queryParams?.filters[0]?.value === this.searchText) {
      return;
    }
    this.queryParams.page = 1;
    this.queryParams.filters = [];
    this.queryParams.filters[0] = {
      propertyName: this.searchField,
      value: this.searchText,
    } as FilterParameters;
    this.changeUrl();
  }

  public pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }

  private changeUrl(): void {
    this.router.navigate(['.'], {
      relativeTo: this.routeActive,
      queryParams: this.queryParams.getQueryObject(),
    });
  }

  public deleteSelected(): void{
    var messagesToDelete = this.messages.filter(val => this.selectedRows.includes(val));
    messagesToDelete.forEach(msg => this.deleteMessage(msg));
    this.deselectAll();
  }

  public deleteMessage(message: ISuggestionMessage): void {
    this.messageService.deleteMessage(message.id).subscribe({
      next: () => {
        if (this.messages.length === 1 && this.queryParams.page > 1) {
          this.queryParams.page -= 1;
        }
        this.getMessages(this.queryParams);
        this.notificationService.success(
          this.translate.instant('components.admin.suggestion-message.delete-success'),
          'X'
        );
      },
      error: (response: any) => {
        const serverError = 500;
        if (response.status === serverError) {
          this.notificationService.error(
            this.translate.instant('common-errors.database-links'),
            'X'
          );
        } else {
          this.notificationService.error(
            this.translate.instant('common-errors.error-message'),
            'X'
          );
        }
      },
    });
  }

public onSelectedRowChange(selectedItem: ISuggestionMessage): void {
  if (this.selectedRows) {
    this.selectedRows = _.xorBy(
      this.selectedRows,
      [selectedItem],
      this.messageProperties[0]
    );
    selectedItem.isChecked = true;
    this.selectedRowsChange.emit(this.selectedRows);

    if(this.selectedRows.length == this.messages.length){ 
      this.selectDeselect = false;  
    }
    if(this.selectedRows.length == 0){
      this.selectDeselect = true;
    }
  }
}

public selectAll(): void{

  if(this.selectDeselect)
  {
    this.messages.forEach(msg => {

      if(!msg.isChecked){
      this.selectedRows = _.xorBy(
        this.selectedRows,
        [msg],
        this.messageProperties[0],
      );

        msg.isChecked = true;
        this.selectedRowsChange.emit(this.selectedRows);
      }
    });
    this.selectDeselect = false;
  }
  else{
    this.deselectAll();
    this.selectDeselect = true;
  }
}

public deselectAll(): void {
  this.messages.forEach(msg => {msg.isChecked = false;})
  this.selectedRows = [];
}

public onViewButtonClicked(user: number) {
  this.router.navigate(['admin', 'user', user]);
}

public onHeaderClicked($event: Sort): void {
  this.queryParams.sort.orderByField = $event.active;
  this.queryParams.sort.orderByAscending = $event.direction === 'asc';
  this.selectedHeaderChange.emit();
  this.changeUrl();
}

public onReply(item: ISuggestionMessage){
  this.emailString = "mailto:"+ item.userEmail + "?subject=" + item.summary + "&body=" + item.text + "%20goes%20here";
  }
}