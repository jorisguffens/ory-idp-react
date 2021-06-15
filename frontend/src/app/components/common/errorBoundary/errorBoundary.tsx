import * as React from "react";

export default class ErrorBoundary extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.state = {
            error: null
        };
    }

    componentDidCatch(error) {
        this.setState({
            error: true
        });

        if ( this.props.onError ) {
            this.props.onError(error);
        }
    }

    render() {
        if ( !this.state.error ) {
            return (<>{this.props.children}</>);
        }

        if ( !this.props.fallback ) {
            return null;
        }

        return this.props.fallback;
    }

}
