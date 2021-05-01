import React from 'react';
import { ComposeThis, ControlProps } from '../../../global';

type State = {};

type Spec = {
    handleClick: (itemValue: number) => void;
    isRequired: () => boolean;
};

type This = ComposeThis<ControlProps, State, Spec>;

function createItems(n: number) {
    return Array.from(Array(n).keys()).map((i) => i + 1);
}

const itemStyle: React.CSSProperties = {
    marginRight: '1%',
    height: '100%',
    maxWidth: '32px',
    cursor: 'pointer'
};

const Star: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 260 245"
        width="260"
        height="245"
        fill="currentColor"
    >
        <path d="M55 237L129 9l74 228L9 96h240" />
    </svg>
);

export default window.createClass<ControlProps, State, Spec>({
    componentDidMount: function (this: This) {
        const min: number | undefined = this.props.field.get('min');
        const max: number = this.props.field.get('max') || 5;
        const defaultValue: number | undefined = this.props.field.get('default');

        let value: number | undefined = this.props.value ? parseInt(this.props.value) : defaultValue;

        if (value && min && value < min) {
            value = min;
        }

        if (value && value > max) {
            value = max;
        }

        if (value) {
            this.props.onChange(value.toString(10));
        }
    },

    isRequired(): boolean {
        const requireField: boolean | undefined = this.props.field.get('require');

        return typeof requireField === 'boolean' ? requireField : true
    },

    handleClick(value) {
        const min: number = this.props.field.get('min') || 1;
        const require: boolean = this.isRequired();

        if (!require && this.props.value === value.toString(10)) {
            this.props.onChange(undefined);
        } else {
            if (value >= min) {
                this.props.onChange(value.toString(10));
            } else {
                this.props.onChange(min.toString(10));
            }
        }
    },

    render: function (this: This) {
        const max: number = this.props.field.get('max') || 5;
        const items = createItems(max).map((currentValue) => {
            return (
                <Star key={currentValue}
                    onClick={() => this.handleClick(currentValue)}
                    style={{
                        ...itemStyle,
                        color:
                            currentValue <= parseInt(this.props.value || '0')
                                ? '#fbc02d'
                                : undefined,
                    }}
                />
            );
        });

        return (
            <div
                data-testid="rating"
                data-value={this.props.value}
                className={this.props.classNameWrapper}
                style={{ display: 'flex' }}
            >
                {items}
            </div>
        );
    },
});
