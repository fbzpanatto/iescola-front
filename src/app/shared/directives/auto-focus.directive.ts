import {AfterContentInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterContentInit {

  constructor(private el: ElementRef) { }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.el.nativeElement.focus()
    }, 500)
  }

}
