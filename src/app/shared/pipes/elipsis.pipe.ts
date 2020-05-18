import { Pipe, PipeTransform } from '@angular/core';
import {IAuthor} from '../../core/models/author';

@Pipe({ name: 'Ellipsis' })
export class EllipsisPipe implements PipeTransform {
  transform(value: any, dataType: string, startsFrom: number = 0): string {
    if(dataType === "genres"){
      let genres = value.slice(startsFrom).map((x)=>x.name).join(', ');
      return genres
    }
    else if(dataType === 'authors'){
      let authors = value.slice(startsFrom).map((x)=>x.firstName + ' ' + x.lastName).join(', ');
      return authors
    }
    else if(dataType === 'title'){
      let title = value.slice(startsFrom);
      return title
    }

  }
}
