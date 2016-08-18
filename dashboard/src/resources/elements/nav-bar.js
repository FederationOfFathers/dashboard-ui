import {bindable} from 'aurelia-framework';
export class NavBarCustomElement {  
  @bindable router;
  
  constructor(){
    this.message = 'hello world';
  }  
}

