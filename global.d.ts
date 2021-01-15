import { ChangeEvent, ClassicComponentClass, Component, ComponentSpec, createElement, Mixin } from 'react';

type ControlProps = {
    value?: string;
    field: Map<string, any>;
    forID: string;
    classNameWrapper: string;
    onChange: (value: string) => void;
    setActiveStyle: () => void;
    setInactiveStyle: () => void;
}

type PreviewProps = {
    value?: string;
    field: Map<string, any>;
    metadata: Map<string, any>;
    getAsset: Function;
    entry: Map<string, any>;
    fieldsMetaData: Map<string, any>;
}

type ComposeThis<Props = {}, State = {}, Spec = {}> = Component<Props, State> & Mixin<Props, State> & Spec
type createReactClass = <Props = {}, State = {}, Spec = {}>(spec: ComponentSpec<Props, State> & Spec) => ClassicComponentClass<Props>;

declare global {
    interface Window {
        createClass: createReactClass;
        h: typeof createElement;
    }
}