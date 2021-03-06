import React, { Component } from 'react'

import Modal from '../../components/UI/Modal/Modal'
import axios from '../../axios-orders';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent) => {
 return class extends Component {
    state = {
        error: null
    }

    // can use 'componentWillMount', added UNSAFE_ to avoid warning in console logs
    UNSAFE_componentWillMount () {
        this.reqInterceptor = axios.interceptors.request.use(req => {
            this.setState({error: null});
            return req;
        });
        this.resInterceptor = axios.interceptors.response.use(res => res, err => {
            this.setState({error: err});
        });
    }

    componentWillUnmount () {
        axios.interceptors.request.eject(this.reqInterceptor);
        axios.interceptors.request.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
        this.setState({error: null});
    }

    render () {
        return (
            <Aux>
                <Modal 
                    show={this.state.error}
                    modalClosed={this.errorConfirmedHandler} >
                    {this.state.error ? this.state.error.message : null}
                </Modal>
                <WrappedComponent {...this.props} />
            </Aux>
        );
    }
    }
}

export default withErrorHandler;