import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../../models/page';
import { PaginationParameters } from 'src/app/core/models/Pagination/paginationParameters';
import { HttpParams, HttpClient } from '@angular/common/http';
import { FilterParameters } from '../../models/Pagination/FilterParameters';
import { SortParameters } from '../../models/Pagination/SortParameters';
import { filter } from 'rxjs/operators';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private page = "page";
  private pageSize = "pageSize";
  private firstRequest = "firstRequest";
  private sortField = "Sort.OrderByField";
  private sortAscending = "Sort.OrderByAscending";
  private filterPropertyName = "PropertyName";
  private filterValue = "Value";
  private filterMethod = "Method";
  private filterOperand = "Operand"
  private filterName = "Filters"

  constructor(private http: HttpClient) { }
  getPage<T>(getUrl: string, paginationParameters: PaginationParameters): Observable<IPage<T>> {
    let params = new HttpParams()
      .set(this.page, paginationParameters.page.toString())
      .set(this.pageSize, paginationParameters.pageSize.toString())
      .set(this.firstRequest, paginationParameters.firstRequest.toString())
    if (paginationParameters.filters) {
      params = this.mapFilter(params, paginationParameters.filters);
    }
    if (paginationParameters.sort) {
      params = this.mapSort(params, paginationParameters.sort);
    }
    return this.http.get<IPage<T>>(getUrl, { params });
  }

  public mapFilter(params: HttpParams, filters: FilterParameters[], filterName = this.filterName): HttpParams {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].propertyName && filters[i].value) {
        params = params
          .set(this.getFilterName(i, filterName, this.filterPropertyName), filters[i].propertyName)
          .set(this.getFilterName(i, filterName, this.filterValue), filters[i].value);

        if (filters[i].method) {
          params = params.set(this.getFilterName(i, filterName, this.filterMethod), filters[i].method)
        }
        if (filters[i].operand) {
          params = params.set(this.getFilterName(i, filterName, this.filterOperand), filters[i].operand)
        }
      }
    }
    return params;
  }
  public mapFromFilter(queryParams : any, filters : FilterParameters[], filterName = this.filterName) : any {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].propertyName && filters[i].value) {
        queryParams[this.getFilterName(i, filterName, this.filterPropertyName)] = filters[i].propertyName;
        queryParams[this.getFilterName(i, filterName, this.filterValue)] = filters[i].value;

        if (filters[i].method) {
          queryParams[this.getFilterName(i, filterName, this.filterMethod)] = filters[i].method;
        }
        if (filters[i].operand) {
          queryParams[this.getFilterName(i, filterName, this.filterOperand)] = filters[i].operand;
        }
      }
    }
    return queryParams;
  }
  public mapSort(params: HttpParams, sort: SortParameters) {
    if (sort.orderByField) {
      params = params.set(this.sortField, sort.orderByField)
        .set(this.sortAscending, sort.orderByAscending.toString())
    }
    return params;
  }
  public mapToPaginationParams(params: Params, defaultPage: number = 1, defultPageSize: number = 10, filterName = this.filterName): PaginationParameters {
    let p = new PaginationParameters;
    p.sort = new SortParameters;
    p.filters = [];
    p.page = params.page ? +params.page : defaultPage;
    p.pageSize = params.pageSize ? +params.pageSize : defultPageSize;
    p.sort.orderByField = params[this.sortField] ? params[this.sortField] : null;
    p.sort.orderByAscending = params[this.sortAscending] ? params[this.sortAscending] : true;
    let filterCount = 0;

    while (params[this.getFilterName(filterCount, filterName, this.filterPropertyName)]) {
      p.filters[filterCount] = new FilterParameters;
      p.filters[filterCount].propertyName = params[this.getFilterName(filterCount, this.filterName, this.filterPropertyName)]
      p.filters[filterCount].value = params[this.getFilterName(filterCount, this.filterName, this.filterValue)]
        ? params[this.getFilterName(filterCount, this.filterName, this.filterValue)]
        : null;
      filterCount++;
    }
    return p;
  }
  public mapToParams(params : PaginationParameters) : object {
    let paramsTemp = {
      page: params.page,
      pageSize: params.pageSize,
      firstRequest: params.firstRequest
    };
    if(params.sort){
      paramsTemp["Sort.OrderByField"] = params.sort.orderByField;      
      paramsTemp["Sort.OrderByAscending"] = params.sort.orderByAscending;
    }
    if(params.filters)
    paramsTemp = this.mapFromFilter(paramsTemp, params.filters);
    return paramsTemp;
  }
  private getFilterName(index: number, name: string, property: string): string {
    return name + "[" + index + "]." + property;
  }

}