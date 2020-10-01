import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appRef]',
})
export class RefDirective {
  public constructor(public containerRef: ViewContainerRef) {}
}
