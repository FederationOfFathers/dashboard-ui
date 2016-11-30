import {bindable, bindingMode, computedFrom} from 'aurelia-framework';

export class SwitchCustomElement{
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;

    toggle(){
        this.value = !!!this.value; //Double ! forces boolean, third ! toggles state
    }

    @computedFrom('value')
    get state(){
        if(this.value){
            return 'on';
        } else {
            return 'off';
        }
    }
}