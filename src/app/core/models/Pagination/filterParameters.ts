import { HttpParams } from '@angular/common/http';

export class FilterParameters {
  private static filterPropertyName = "PropertyName";
  private static filterValue = "Value";
  private static filterMethod = "Method";
  private static filterOperand = "Operand";

  propertyName: string;
  value: string;
  method?: string;
  operand?: string;

  static mapFilter(params: HttpParams, filters: FilterParameters[], filterName: string): HttpParams {    
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

  static mapFilterFromQuery(params: any, filterName: string): FilterParameters[] {
    let filterCount = 0;
    let filters = [];
    while (params[this.getFilterName(filterCount, filterName, this.filterPropertyName)] && params[this.getFilterName(filterCount, filterName, this.filterValue)]) {
      filters[filterCount] = new FilterParameters;
      filters[filterCount].propertyName = params[this.getFilterName(filterCount, filterName, this.filterPropertyName)]
      filters[filterCount].value = params[this.getFilterName(filterCount, filterName, this.filterValue)]
        ? params[this.getFilterName(filterCount, filterName, this.filterValue)]
        : null;
      if (params[this.getFilterName(filterCount, filterName, this.filterMethod)]) {
        filters[filterCount].method = params[this.getFilterName(filterCount, filterName, this.filterMethod)];
      }
      if (params[this.getFilterName(filterCount, filterName, this.filterOperand)]) {
        filters[filterCount].operand = params[this.getFilterName(filterCount, filterName, this.filterOperand)];
      }
      filterCount++;
    }
    return filters;
  }

  static mapFilterToQuery(queryParams: any, filters: FilterParameters[], filterName : string): any {
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

  private static getFilterName(index: number, name: string, property: string): string {
    return name + "[" + index + "]." + property;
  }
}
