import {bindable, containerless, customElement, inject, inlineView, Loader} from 'aurelia-framework';

@containerless()
@inlineView('<template></template>')
@customElement('inline-svg')
@inject(Element, Loader)
export class InlineSvg {
    @bindable svg;

    constructor(el, loader) {
        this.el = el;
        this.loader = loader;
        this.classList;
        this.targetInstruction;
        this.view;
    }

    created(view){
        this.view = view;
        this.targetInstruction = this.getTargetInstructionByType('class');
    }

    getTargetInstructionByType(type){
        let targetInst;
        for(let instKey in this.view.viewFactory.instructions){
            let inst = this.view.viewFactory.instructions[instKey];
            if (inst.expressions && inst.expressions.length > 0){
                let classExp = inst.expressions.some(exp => {
                    return exp.attribute == type
                });
                if(classExp){
                    targetInst = inst;
                }
            }
        }
        return targetInst;
    }
    
    bind(context){
        this.classList = this.el.class; //this.el is a comment
        this.svgChanged(this.svg);
    }


    svgChanged(svg) {
        if (svg) {
            this.loader.loadText(`${svg}.svg`)
                .then(text => {
                    let nextSibling = this.el.nextElementSibling;

                    let containerDiv = document.createElement("div");
                    containerDiv.innerHTML = text;

                    let svgElem = containerDiv.children[0];
                
                    let previousClassBindingIndex = this.view.bindings.findIndex(binding => {
                        return binding.target == nextSibling;
                    });

                    if(previousClassBindingIndex > -1){
                        this.view.bindings.splice(previousClassBindingIndex, 1);
                    }
                    
                    if(this.targetInstruction){
                        let svgBinding = this.targetInstruction.expressions[0].createBinding(svgElem);
                        this.view.addBinding(svgBinding);
                    } else {
                        svgElem.setAttribute('class', this.classList);
                    }

                    if(nextSibling && nextSibling.tagName.toLowerCase() == 'svg'){
                        nextSibling.parentElement.replaceChild(svgElem, nextSibling);
                    } else {
                        this.el.parentElement.insertBefore(svgElem, this.el.nextSibling);
                    }
                });
        }
    }
}