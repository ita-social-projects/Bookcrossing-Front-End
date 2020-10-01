import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appDefaultImage]',
  /* tslint:disable */
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src',
    /* tslint:enable */
  },
})
export class DefaultImageDirective {
  @Input() src: string;
  @Input() default: string;

  public updateUrl(): void {
    this.src = this.default;
  }
}
