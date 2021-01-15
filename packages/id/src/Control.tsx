import { ChangeEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ComposeThis, ControlProps } from '../../../global';

type State = {}

type Spec = {
    handleChange: (this: This, event: ChangeEvent<HTMLInputElement>) => void;
}

type This = ComposeThis<ControlProps, State, Spec>

export default window.createClass<ControlProps, State, Spec>({
    componentDidMount: function (this: This) {
        const value = this.props.value ? this.props.value : uuidv4();
        this.props.onChange(value)
    },

    handleChange: function(event) {
        this.props.onChange(event.target.value.trim());
    },

    render: function(this: This) {
        return (
            <input
                style={{
                    backgroundColor: '#f5f5f5',
                    color: '#9E9E9E'
                }}
                type="text"
                disabled={true}
                value={this.props.value}
                onChange={this.handleChange}
                className={this.props?.classNameWrapper}
            />
        );
    }
});
