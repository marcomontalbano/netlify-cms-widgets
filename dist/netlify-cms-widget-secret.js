this.marcomontalbano = this.marcomontalbano || {};
this.marcomontalbano.netlifyCmsWidgetSecret = (function () {
    'use strict';

    var Control = window.createClass({
        getInitialState: function () {
            return {
                inputType: 'password'
            };
        },
        handleChange: function (event) {
            this.props.onChange(btoa(event.target.value.trim()));
        },
        render: function () {
            var _this = this;
            var fill = this.state.inputType === 'password' ? 'rgb(121, 130, 145)' : 'rgb(58, 105, 199)';
            return (window.h("div", { style: { position: 'relative' } },
                window.h("input", { "data-testid": "input", id: this.props.forID, type: this.state.inputType, value: atob(this.props.value || ''), onChange: this.handleChange, onFocus: function () { return _this.props.setActiveStyle(); }, onBlur: function () { return _this.props.setInactiveStyle(); }, className: this.props.classNameWrapper }),
                window.h("img", { "data-testid": "icon", src: "data:image/svg+xml,<svg viewBox=\"0 0 21 12\" fill=\"" + fill + "\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M20.557 5.492C19.13 4 14.849 0 10.395 0C5.595 0 1.551 4 0.211003 5.492C0.075371 5.63932 8.39233e-05 5.83225 8.39233e-05 6.0325C8.39233e-05 6.23275 0.075371 6.42568 0.211003 6.573C1.55 8.043 5.616 12 10.395 12C15.151 12 19.195 8.086 20.557 6.595C20.7025 6.44834 20.7842 6.25011 20.7842 6.0435C20.7842 5.83689 20.7025 5.63866 20.557 5.492ZM10.417 10.184C9.32712 10.1671 8.28759 9.72225 7.52284 8.94554C6.75808 8.16882 6.32944 7.12252 6.32944 6.0325C6.32944 4.94248 6.75808 3.89618 7.52284 3.11946C8.28759 2.34275 9.32712 1.89792 10.417 1.881C11.5177 1.88153 12.5731 2.31907 13.3513 3.09745C14.1295 3.87582 14.5667 4.93134 14.567 6.032C14.567 8.324 12.687 10.184 10.417 10.184ZM10.417 7.394C10.7782 7.394 11.1247 7.2505 11.3801 6.99508C11.6355 6.73965 11.779 6.39322 11.779 6.032C11.779 5.67077 11.6355 5.32434 11.3801 5.06892C11.1247 4.8135 10.7782 4.67 10.417 4.67C10.0556 4.67 9.70909 4.81355 9.45357 5.06907C9.19805 5.32459 9.0545 5.67114 9.0545 6.0325C9.0545 6.39386 9.19805 6.74041 9.45357 6.99593C9.70909 7.25145 10.0556 7.395 10.417 7.395V7.394Z\" /></svg>", style: {
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        cursor: 'pointer',
                    }, onClick: function () {
                        _this.setState(function (prevState) { return ({
                            inputType: prevState.inputType === 'password' ? 'text' : 'password'
                        }); });
                    } })));
        }
    });

    var index = {
        name: 'secret',
        controlComponent: Control,
    };

    return index;

}());
