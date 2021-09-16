import { Directive, ElementRef, HostListener, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appMaterialElevation]'
})
export class MaterialElevationDirective implements OnChanges {

  @Input()
  defaultElevation = 2;

  @Input()
  raisedElevation = 8;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    this.setElevation(this.defaultElevation);
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.setElevation(this.defaultElevation);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.setElevation(this.raisedElevation);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setElevation(this.defaultElevation);
  }

  setElevation(amount: number) {
    // tolgo l'elevation
    const classesToRemove = Array.from((<HTMLElement>this.element.nativeElement).classList).filter(c => c.startsWith('mat-elevation-z'));
    classesToRemove.forEach((c) => {
      this.renderer.removeClass(this.element.nativeElement, c);
    });

    // imposto la class mat-elevation
    const newClass = `mat-elevation-z${amount}`;
    this.renderer.addClass(this.element.nativeElement, newClass);
  }
}