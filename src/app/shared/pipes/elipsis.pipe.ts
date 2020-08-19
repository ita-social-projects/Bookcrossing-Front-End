import { Pipe, PipeTransform } from '@angular/core';
import { IAuthor } from '../../core/models/author';

@Pipe({ name: 'Ellipsis' })
export class EllipsisPipe implements PipeTransform {
  public transform(value: any, dataType: string, startsFrom: number = 0): string {
    if (dataType === 'genres') {
      const genres = value
        .slice(startsFrom)
        .map((x) => x.name)
        .join(', ');
      return genres;
    } else if (dataType === 'authors') {
      const authors = value
        .slice(startsFrom)
        .map((x) => x.firstName + ' ' + x.lastName)
        .join(', ');
      return authors;
    } else if (dataType === 'title') {
      const title = value.slice(startsFrom);
      return title;
    }
  }
}
