import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false,
})

export class FilterPipe implements PipeTransform {
  public transform(list: any[], search: string = '', field: string = 'id'): any[] {
    if (!search.trim()) {
      return list;
    }
    return list.filter((item) => {
      if (typeof item[field] === 'number') {
        return item[field].toString().startsWith(search);
      }
      return item[field].toLowerCase().includes(search.toLowerCase());
    });
  }
}
