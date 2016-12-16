import {BindingEngine, inject, bindable} from 'aurelia-framework';

@inject(BindingEngine)
export class SortedList {
  @bindable items;
  @bindable unsorted;

  constructor(bindingEngine){
      this.bindingEngine = bindingEngine;
      this.groups = [];

        
  }

  itemsChanged(splices){
    //console.log('changed');
    //console.log(this.items);
    if(this.unsorted){
        this.groups = [{
            name: '',
            items: this.items
        }];
    } else {
        this.groups = this.groupByFirstChar(this.items);
    }
  }

  groupByFirstChar(list){
      let mappedList = new Map();
      for(let i = 0; i < list.length; i++){
          //TODO: future functionality, pass in variable for what property to group on
          let firstChar = list[i].name[0].toUpperCase();
          if (mappedList.has(firstChar)){
              mappedList.get(firstChar).push(list[i]);
          } else {
              mappedList.set(firstChar, [list[i]]);
          }
      }
      mappedList.forEach((value, key, map) => {
          value.sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        });
      });
      return Array.from(mappedList, item => {
          return {
              name: item[0],
              items: item[1]
          }
      }).sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        });
  }

  bind(){
      this.subscription = this.bindingEngine.collectionObserver(this.items).subscribe((splices)=>this.itemsChanged(splices));
      this.itemsChanged();
  }
  detached(){
      this.subscription.dispose();
  }
  
}

