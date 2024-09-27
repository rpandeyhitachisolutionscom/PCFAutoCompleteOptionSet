import * as React from 'react';
import { useState } from 'react';
import { ComboBox, IComboBox, type IComboBoxOption, type IComboBoxStyles } from '@fluentui/react';
import { IInputs } from './generated/ManifestTypes';

const comboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 300 } };
export interface AutoCompleteComponentProps {
    label: string;
    value: number | null;
    options: ComponentFramework.PropertyHelper.OptionMetadata[];
    onChanges: (newValue: string | undefined) => void;
    context: ComponentFramework.Context<IInputs>
}

export const AutoCompleteComponent = React.memo((props: AutoCompleteComponentProps) => {

    const [option, setOptions] = useState<IComboBoxOption[]>([]);
    const [filtoption, setFiltOptions] = useState<IComboBoxOption[]>([]);
    const [value, setValue] = useState<string | null>();
    const [key, setKey] = useState<string | number | null>();
    const optionSetvalue: IComboBoxOption[] = [];

    React.useEffect(() => {
        console.log("Roshan pandey is on fiddler");
        const optionSet = props.options;
        if (optionSet) {
            optionSet.forEach(d => {
                optionSetvalue.push({
                    text: d.Label, key: d.Value
                })
            })
            if (props.value) {
                const selectedKey = optionSetvalue.find(d => d.key == props.value);
                setKey(selectedKey?.key);
            }

            setOptions(optionSetvalue);
            setValue(props.value?.toString());
        }
    }, [value])


    const handleChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        setValue(option?.text.toString());
        const selectedOption = props.options.find(
            (option1) => option1.Label === option?.text.toString()
        );
        setKey(option?.key);
        if (option?.text.toString() == '') {
            setOptions(optionSetvalue);
        }
        else {
            const t: string = option?.text.toString() || '';
            const op = optionSetvalue.filter((option1) =>
                option1.text.toLowerCase().startsWith(t)
            );
            setOptions(op);
        }

        if (option) {
            props.onChanges(option.text.toString());

        }
    };

    function handleInputChnage(text: string): void {
        const optionSet = props.options;
        if (text.toString() == '') {
            setKey('');
            props.onChanges(text.toString());
            if (optionSet) {
                optionSet.forEach(d => {
                    optionSetvalue.push({
                        text: d.Label, key: d.Value
                    })
                })
            }
            setOptions(optionSetvalue);
        }
        else {
            if (optionSet) {
                optionSet.forEach(d => {
                    optionSetvalue.push({
                        text: d.Label, key: d.Value
                    })
                })
            }
            const t: string = text.toString() || '';
            const op = optionSetvalue.filter((option1) =>
                option1.text.toLowerCase().startsWith(t[0])
            );
            setOptions(op);
        }

    }

    return (
        <ComboBox
            options={option}
            styles={comboBoxStyles}
            allowFreeInput
            autoComplete="on"
            onChange={handleChange}
            onInputValueChange={handleInputChnage}
            selectedKey={key}
        />
    );

});
AutoCompleteComponent.displayName = 'AutoCompleteComponent';