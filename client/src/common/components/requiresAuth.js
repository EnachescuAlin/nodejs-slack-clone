import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

export default function (WrappedComponent) {
    class Authenticate extends Component {
        render() {
            return ( 
                <React.Fragment> 
                    {this.props.isAuthenticated ? <WrappedComponent { ...this.props } /> : null } 
                </React.Fragment>
            );
        }

        componentWillMount() {
            this.checkAndRedirect();
        }

        checkAndRedirect() {
            if (!this.props.isAuthenticated) {
                this.props.history.push('/login');
            }
        }
    }

    const mapStateToProps = (state) => {
        return {
            isAuthenticated: state.authentication.token && state.authentication.token.length > 0
        };
    };

    Authenticate.propTypes = {
        isAuthenticated: PropTypes.bool
    };

    return withRouter(connect(mapStateToProps, null)(Authenticate));
}