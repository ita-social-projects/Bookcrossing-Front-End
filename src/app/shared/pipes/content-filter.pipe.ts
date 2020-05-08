import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "contentFilter",
})
export class ContentFilterPipe implements PipeTransform {
  // itemFound: boolean = false;
  transform(items: any[], keyword: any, properties: string[]): any[] {
    if (!items) {
      return [];
    }
    if (!keyword) {
      return items;
    }
    return items.filter((item) => {
      let itemFound: Boolean;
      for (let i = 0; i < properties.length; i++) {
        if (
          item[properties[i]]?.toLowerCase().indexOf(keyword.toLowerCase()) !==
          -1
        ) {
          itemFound = true;
          break;
        }
      }

      return itemFound;
    });
  }
}
