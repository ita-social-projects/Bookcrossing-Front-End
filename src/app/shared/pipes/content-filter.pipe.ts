import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contentFilter',
})
export class ContentFilterPipe implements PipeTransform {
  // itemFound: boolean = false;
  public transform(items: any[], keyword: any, properties: string[]): any[] {
    if (!items) {
      return [];
    }
    if (!keyword) {
      return items;
    }
    return items.filter((item) => {
      let itemFound: boolean;
      for (const property of properties) {
        if (
          item[property]?.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        ) {
          itemFound = true;
          break;
        }
      }

      return itemFound;
    });
  }
}
