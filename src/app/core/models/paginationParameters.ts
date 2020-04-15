export class PaginationParameters {
    page: number = 1;
    pageSize: number = 10;
    firstRequest?: boolean = true;
    searchQuery?: string;
    searchField?: string;
    orderByField?: string;
    orderByAscending?: boolean = true;
  } 