import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[appDefaultImage]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class DefaultImageDerective {
  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src = this.default;
  }
}
