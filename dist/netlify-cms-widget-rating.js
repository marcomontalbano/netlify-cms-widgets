this.marcomontalbano = this.marcomontalbano || {};
this.marcomontalbano.netlifyCmsWidgetRating = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function createItems(n) {
        return Array.from(Array(n).keys()).map(function (i) { return i + 1; });
    }
    var itemStyle = {
        marginRight: '1%',
        height: '100%',
        maxWidth: '32px',
        cursor: 'pointer'
    };
    var Star = function (props) { return (window.h("svg", __assign({}, props, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 260 245", width: "260", height: "245", fill: "currentColor" }),
        window.h("path", { d: "M55 237L129 9l74 228L9 96h240" }))); };
    var Control = window.createClass({
        componentDidMount: function () {
            var min = this.props.field.get('min');
            var max = this.props.field.get('max') || 5;
            var defaultValue = this.props.field.get('default');
            var value = this.props.value ? parseInt(this.props.value) : defaultValue;
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
        isRequired: function () {
            var requireField = this.props.field.get('require');
            return typeof requireField === 'boolean' ? requireField : true;
        },
        handleClick: function (value) {
            var min = this.props.field.get('min') || 1;
            var require = this.isRequired();
            if (!require && this.props.value === value.toString(10)) {
                this.props.onChange(undefined);
            }
            else {
                if (value >= min) {
                    this.props.onChange(value.toString(10));
                }
                else {
                    this.props.onChange(min.toString(10));
                }
            }
        },
        render: function () {
            var _this = this;
            var max = this.props.field.get('max') || 5;
            var items = createItems(max).map(function (currentValue) {
                return (window.h(Star, { key: currentValue, onClick: function () { return _this.handleClick(currentValue); }, style: __assign(__assign({}, itemStyle), { color: currentValue <= parseInt(_this.props.value || '0')
                            ? '#fbc02d'
                            : undefined }) }));
            });
            return (window.h("div", { "data-testid": "rating", "data-value": this.props.value, className: this.props.classNameWrapper, style: { display: 'flex' } }, items));
        },
    });

    var Preview = window.createClass({
        render: function () {
            return (window.h("p", null, this.props.value));
        }
    });

    var index = {
        name: 'rating',
        controlComponent: Control,
        previewComponent: Preview,
    };

    return index;

}());
