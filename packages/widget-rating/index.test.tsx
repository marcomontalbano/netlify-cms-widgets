import { render, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { ControlProps } from '../../global';

import widget from './index';

const ControlComponent = (props: Partial<ControlProps>) => {
    const [value, setValue] = useState<string>();

    return (
        <widget.controlComponent
            classNameWrapper="class-name"
            field={new Map()}
            forID="input-id"
            onChange={(value) => setValue(value)}
            value={value}
            setActiveStyle={() => {}}
            setInactiveStyle={() => {}}
            {...props}
        />
    );
};

describe('Widget "rating"', () => {
    it('should have a proper name', () => {
        expect(widget.name).toEqual('rating');
    });

    it('should render the preview component', () => {
        const component = (
            <widget.previewComponent
                entry={new Map()}
                field={new Map()}
                fieldsMetaData={new Map()}
                getAsset={() => {}}
                metadata={new Map()}
                value="0"
            />
        );

        const { container } = render(component);

        expect(container.children.length).toBe(1);
        expect(container.innerHTML).toBe('<p>0</p>');
    });

    it('should render the control component', () => {
        const component = <ControlComponent />;

        const { getByTestId } = render(component);
        const rating = getByTestId('rating') as HTMLDivElement;

        expect(rating.className).toBe('class-name');
        expect(rating.children.length).toEqual(5);

        expect(rating.children[0]).not.toHaveStyle({ color: '#fbc02d' });
        expect(rating.children[1]).not.toHaveStyle({ color: '#fbc02d' });
        expect(rating.children[2]).not.toHaveStyle({ color: '#fbc02d' });
        expect(rating.children[3]).not.toHaveStyle({ color: '#fbc02d' });
        expect(rating.children[4]).not.toHaveStyle({ color: '#fbc02d' });
    });

    it('should render the control component with the pre-saved value', () => {
        const component = <ControlComponent value="2" />;

        const { getByTestId } = render(component);
        const rating = getByTestId('rating') as HTMLDivElement;

        expect(rating.className).toBe('class-name');
        expect(rating.children.length).toEqual(5);

        expect(rating.children[0]).toHaveStyle({ color: '#fbc02d' });
        expect(rating.children[1]).toHaveStyle({ color: '#fbc02d' });
        expect(rating.children[2]).not.toHaveStyle({ color: '#fbc02d' });
        expect(rating.children[3]).not.toHaveStyle({ color: '#fbc02d' });
        expect(rating.children[4]).not.toHaveStyle({ color: '#fbc02d' });
    });

    describe('selection', () => {
        it('should update the value when click on a star', async () => {
            const component = <ControlComponent />;

            const { getByTestId } = render(component);

            const rating = getByTestId('rating') as HTMLDivElement;

            await fireEvent.click(rating.children[3]);

            expect(rating.children[0]).toHaveStyle({ color: '#fbc02d' });
            expect(rating.children[1]).toHaveStyle({ color: '#fbc02d' });
            expect(rating.children[2]).toHaveStyle({ color: '#fbc02d' });
            expect(rating.children[3]).toHaveStyle({ color: '#fbc02d' });
            expect(rating.children[4]).not.toHaveStyle({ color: '#fbc02d' });
        });
    })

    describe('widget options', () => {
        describe('require', () => {
            it('should not change the value when click on a star that is already selected and "require" is set to true (default)', async () => {
                const component = <ControlComponent />;

                const { getByTestId } = render(component);

                const rating = getByTestId('rating') as HTMLDivElement;

                await fireEvent.click(rating.children[3]);

                await fireEvent.click(rating.children[3]);

                expect(rating.children[0]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[1]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[2]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[3]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[4]).not.toHaveStyle({ color: '#fbc02d' });
            });

            it('should set the value to 0 when click on a star that is already selected and "require" is set to false', async () => {
                const component = <ControlComponent field={new Map([['require', false]])} />;

                const { getByTestId } = render(component);

                const rating = getByTestId('rating') as HTMLDivElement;

                await fireEvent.click(rating.children[3]);

                await fireEvent.click(rating.children[3]);

                expect(rating.children[0]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[1]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[2]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[3]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[4]).not.toHaveStyle({ color: '#fbc02d' });
            });
        })

        describe('min', () => {
            it('should not change the selected value to the "min" value if no "default" is provided', () => {
                const component = <ControlComponent field={new Map([['min', 2]])} />;

                const { getByTestId } = render(component);
                const rating = getByTestId('rating') as HTMLDivElement;

                expect(rating.children.length).toEqual(5);

                expect(rating.children[0]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[1]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[2]).not.toHaveStyle({
                    color: '#fbc02d',
                });
                expect(rating.children[3]).not.toHaveStyle({
                    color: '#fbc02d',
                });
                expect(rating.children[4]).not.toHaveStyle({
                    color: '#fbc02d',
                });
            });

            it('should change the selected value to the "min" value if the provided "default" value is lower than the min value', () => {
                const component = (
                    <ControlComponent
                        field={
                            new Map([
                                ['min', 2],
                                ['default', 1],
                            ])
                        }
                    />
                );

                const { getByTestId } = render(component);
                const rating = getByTestId('rating') as HTMLDivElement;

                expect(rating.children.length).toEqual(5);

                expect(rating.children[0]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[1]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[2]).not.toHaveStyle({
                    color: '#fbc02d',
                });
                expect(rating.children[3]).not.toHaveStyle({
                    color: '#fbc02d',
                });
                expect(rating.children[4]).not.toHaveStyle({
                    color: '#fbc02d',
                });
            });

            it('should set the value to the "min" value when click on an item which value i lower that the provided "min"', async () => {
                const component = <ControlComponent field={new Map([['min', 3]])} />;

                const { getByTestId } = render(component);

                const rating = getByTestId('rating') as HTMLDivElement;

                await fireEvent.click(rating.children[0]);

                expect(rating.children[0]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[1]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[2]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[3]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[4]).not.toHaveStyle({ color: '#fbc02d' });
            });
        });

        describe('max', () => {
            it('should render the control component with a number of stars that match the provided "max" value', () => {
                const component = <ControlComponent field={new Map([['max', 10]])} />;

                const { getByTestId } = render(component);

                const rating = getByTestId('rating') as HTMLDivElement;

                expect(rating.children.length).toEqual(10);
                expect(rating.children[0]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[1]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[2]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[3]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[4]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[5]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[6]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[7]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[8]).not.toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[9]).not.toHaveStyle({ color: '#fbc02d' });
            });

            it('should selected the higher start if provided "default" value is higher than the "max" value', () => {
                const component = (
                    <ControlComponent
                        field={
                            new Map([
                                ['max', 10],
                                ['default', 12],
                            ])
                        }
                    />
                );

                const { getByTestId } = render(component);

                const rating = getByTestId('rating') as HTMLDivElement;

                expect(rating.dataset.value).toEqual('10');
                
                expect(rating.children.length).toEqual(10);
                expect(rating.children[0]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[1]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[2]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[3]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[4]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[5]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[6]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[7]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[8]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[9]).toHaveStyle({ color: '#fbc02d' });
            });
        });

        describe('default', () => {
            it('should preselect the provided "default" value', () => {
                const component = <ControlComponent field={new Map([['default', 4]])} />;

                const { getByTestId } = render(component);
                const rating = getByTestId('rating') as HTMLDivElement;

                expect(rating.children.length).toEqual(5);

                expect(rating.children[0]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[1]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[2]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[3]).toHaveStyle({ color: '#fbc02d' });
                expect(rating.children[4]).not.toHaveStyle({ color: '#fbc02d' });
            });
        })
    });
});
