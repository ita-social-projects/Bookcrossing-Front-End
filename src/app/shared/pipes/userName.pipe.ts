import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UserName' })
export class UserNamePipe implements PipeTransform {
  transform(value: any): string {
    return value.substring(0, value.lastIndexOf("@"));
  }
}
