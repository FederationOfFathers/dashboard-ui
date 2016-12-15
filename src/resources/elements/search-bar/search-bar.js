import {bindable} from 'aurelia-framework';
import {bindingMode} from 'aurelia-binding';

export class SearchBar {
  @bindable({defaultBindingMode: bindingMode.twoWay}) query;

  constructor(){
  }
  
}

