import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UserName' })
export class UserNamePipe implements PipeTransform {
  public transform(value: any): string {
    return value.substring(0, value.lastIndexOf('@'));
  }
}
