import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class ChannelActionPrompt {

  constructor(controller){
    this.controller = controller;
    this.title = '';
    this.body = '';
  }
  activate(details){
    this.details = details;
    if (this.details.admin){
      this.title = "Modify Channel";
      this.body = `What do you want to do for the channel <mark>${this.details.channel.name}</mark>?`
    } else {
      this.title = this.details.title;
      this.body = this.details.body;
    }
  }
}