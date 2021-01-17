import { render, fireEvent } from '@testing-library/react'
import * as uuid from 'uuid'

import widget from './index'

jest.mock('uuid');

const uuidv4 = uuid.v4 as jest.Mock;

describe('Widget "id"', () => {

    beforeEach(() => {
        uuidv4.mockReset();
    });

    it('should have a proper name', () => {
        expect(widget.name).toEqual('id');
    })

    it('should render the preview component', () => {
        const component = <widget.previewComponent
            entry={new Map()}
            field={new Map()}
            fieldsMetaData={new Map()}
            getAsset={() => {}}
            metadata={new Map()}
            value="Hi there!" />

        const { container } = render(component);

        expect(container.children.length).toBe(1);
        expect(container.innerHTML).toBe('<p>Hi there!</p>');
    })

    it('should render the control component with a value coming from props', () => {
        const component = <widget.controlComponent
            classNameWrapper="class-name"
            field={new Map()}
            forID="input-id"
            onChange={() => {}}
            setActiveStyle={() => {}}
            setInactiveStyle={() => {}}
            value="Hi there!" />

        const { getByTestId, container } = render(component);

        const input = getByTestId('input') as HTMLInputElement;

        expect(container.children.length).toBe(1);
        expect(input.hasAttribute('disabled')).toBeTruthy();
        expect(input.hasAttribute('style')).toBeTruthy();
        expect(input.className).toBe('class-name');
        expect(input.type).toBe('text');
        expect(input.value).toBe('Hi there!');
    })

    it('should render the control component with a value coming from uuid when value is empty', () => {
        uuidv4.mockReturnValue('new-uuid');

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

        expect(input.hasAttribute('disabled')).toBeTruthy();
        expect(input.hasAttribute('style')).toBeTruthy();
        expect(input.className).toBe('class-name');
        expect(input.type).toBe('text');
        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toBeCalledWith('new-uuid');
    })

    it('should update value when change', async () => {
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

        expect(onChange).toBeCalledTimes(2);
        expect(onChange).toBeCalledWith('Hi there!');
    })
})
