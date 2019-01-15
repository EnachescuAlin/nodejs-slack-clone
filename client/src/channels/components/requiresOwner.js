import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Spinner from '../../common/components/Spinner';
import { actions } from '..';
import { bindActionCreators } from 'redux';

export default (WrappedComponent) => {
    class VerifyOwner extends Component {
        isOwner = () => this.props.user && this.props.channel && this.props.channel.createdBy === this.props.user.id;

        render() {
            return ( 
                <React.Fragment> 
                    {this.props.user && this.props.channel && this.isOwner() ? <WrappedComponent { ...this.props } /> : <Spinner /> } 
                </React.Fragment>
            );
        }

        componentWillMount() {
            if (!this.props.channel)
                this.props.actions.selectChannel(this.props.match.params.channelId).then(() => this.checkAndRedirect());
        }

        checkAndRedirect() {
            if (!this.isOwner()) {
                this.props.history.replace('/');
            }
        }
    }

    const mapStateToProps = (state) => ({
        user: state.authentication.user,
        channel: state.channels.selected
    });

    const mapDispatchToProps = (dispatch) => ({
        actions: bindActionCreators(actions, dispatch)
    });

    VerifyOwner.propTypes = {
        user: PropTypes.object,
        channel: PropTypes.object,
        history: ReactRouterPropTypes.history.isRequired,
        match: ReactRouterPropTypes.match.isRequired
    };

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifyOwner));
};