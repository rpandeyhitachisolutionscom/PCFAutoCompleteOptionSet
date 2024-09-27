import * as ReactDOM from "react-dom";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { AutoCompleteComponent } from './AutoCompleteComponent';

export class Autocomplete implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    notifyOutputChanged: () => void;
    rootContainer: HTMLDivElement;
    selectedValue: number | null;
    context: ComponentFramework.Context<IInputs>;
    constructor() {

    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.rootContainer = container;
        this.context = context;
    }

    onChange = (newValue: string | undefined): void => {
        this.context.parameters.value.raw = this.context.parameters.value.attributes?.Options.find(d => d.Label == newValue)?.Value || 0;
        this.selectedValue = this.context.parameters.value.attributes?.Options.find(d => d.Label == newValue)?.Value || 0;
        this.notifyOutputChanged();
    };

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const { value } = context.parameters;
        if (value && value.attributes) {
            ReactDOM.render(
                React.createElement(AutoCompleteComponent, {
                    label: value.attributes.DisplayName,
                    options: value.attributes.Options,
                    value: value.raw,
                    onChanges: this.onChange,
                    context: this.context
                }),
                this.rootContainer,
            );
        }
    }


    public getOutputs(): IOutputs {
        return { value: this.selectedValue } as IOutputs;
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.rootContainer);
    }
}
