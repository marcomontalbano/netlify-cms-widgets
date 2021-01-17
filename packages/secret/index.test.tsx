import { render, fireEvent } from '@testing-library/react'

import widget from './index'

describe('Widget "secret"', () => {

    it('should have a proper name', () => {
        expect(widget.name).toEqual('secret');
    })

    it('should decode a base-64 econded string and assign the output to the input value', () => {
        const component = <widget.controlComponent
            classNameWrapper="class-name"
            field={new Map()}
            forID="input-id"
            onChange={() => {}}
            setActiveStyle={() => {}}
            setInactiveStyle={() => {}}
            value="U2VjcmV0IFRlc3QgOik=" />

        const { getByTestId, container } = render(component);

        const input = getByTestId('input') as HTMLInputElement;

        expect(container.children.length).toBe(1);
        expect(input.hasAttribute('disabled')).toBeFalsy();
        expect(input.hasAttribute('style')).toBeFalsy();
        expect(input.className).toBe('class-name');
        expect(input.type).toBe('password');
        expect(input.value).toBe('Secret Test :)');
    })

    it('should change the type from password to text when the eye icon is clicked and vice-versa', async () => {
        const component = <widget.controlComponent
            classNameWrapper="class-name"
            field={new Map()}
            forID="input-id"
            onChange={() => {}}
            setActiveStyle={() => {}}
            setInactiveStyle={() => {}}
            value="U2VjcmV0IFRlc3QgOik=" />

        const { getByTestId } = render(component);

        const input = getByTestId('input') as HTMLInputElement;
        const icon = getByTestId('icon');

        expect(input.type).toBe('password');

        await fireEvent.click(icon);
        expect(input.type).toBe('text');

        await fireEvent.click(icon);
        expect(input.type).toBe('password');
    })

    it('should encode the value to base64', async () => {
        const onChange = jest.fn();

        const component = <widget.controlComponent
            classNameWrapper="class-name"
            field={new Map()}
            forID="input-id"
            onChange={onChange}
            setActiveStyle={() => {}}
            setInactiveStyle={() => {}} />

        const { getByTestId } = render(component);

        const input = getByTestId('input') as HTMLInputElement;

        await fireEvent.change(input, { target: { value: 'Hi there!' } })

        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toBeCalledWith('SGkgdGhlcmUh');
    })
})
