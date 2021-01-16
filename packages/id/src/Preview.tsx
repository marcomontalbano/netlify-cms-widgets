import { ComposeThis, PreviewProps } from '../../../global';

export default window.createClass<PreviewProps>({
    render: function(this: ComposeThis<PreviewProps>) {
        return (
            <p>{this.props.value}</p>
        );
    }
});
