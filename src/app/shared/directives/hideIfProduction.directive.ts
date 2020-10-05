import { Directive, ViewContainerRef, OnInit, TemplateRef } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[appHideProd]'
})
export class HideProdDirective implements OnInit {

  constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    if (environment.production) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
