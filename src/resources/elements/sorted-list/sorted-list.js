import {bindable} from 'aurelia-framework';

export class SortedList {
  @bindable items;

  constructor(){
      this.groups = [];
  }

  itemsChanged(){
      console.log('changed');
      this.groups = this.groupByFirstChar(this.items);
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
      return Array.from(mappedList, item => {
          return {
              name: item[0],
              items: item[1]
          }
      });
  }
  
}

