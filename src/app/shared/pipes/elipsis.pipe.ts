import { Pipe, PipeTransform } from '@angular/core';
import {IAuthor} from '../../core/models/author';

@Pipe({ name: 'Ellipsis' })
export class EllipsisPipe implements PipeTransform {
  transform(value: any, array: string = "genres", startsFrom: number = 0): string {
    if(array === "genres"){
      let genres = value.slice(startsFrom).map((x)=>x.name).join(', ');
      return genres
    }
    else if(array === 'authors'){
      let authors = value.slice(startsFrom).map((x)=>x.firstName + ' ' + x.lastName).join(', ');
      return authors
    }

  }
}
