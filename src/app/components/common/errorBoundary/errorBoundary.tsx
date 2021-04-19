import * as React from "react";

export default class ErrorBoundary extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null
        };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    render() {
        if ( !this.state.error ) {
            return (<>{this.props.children}</>);
        }

        if ( typeof this.props.fallback === 'function' ) {
            return this.props.fallback();
        }

        return this.props.fallback;
    }

}
