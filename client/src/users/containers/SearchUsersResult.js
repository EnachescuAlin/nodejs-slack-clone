import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../common/components/Spinner';
import UserDetails from '../components/UserDetails';
import { actions } from '../../authentication/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactRouterPropTypes from 'react-router-prop-types';

class SearchUsersResult extends Component {
    componentWillMount() {
        this.props.actions.searchUsers(this.props.match.params.name);
    }

    onJoin = async (userId) => {
        await this.props.actions.newDirectMessage(userId);
    }
    
    render() {
        return (
            <React.Fragment>
                { 
                    this.props.searchResult ?
                        this.props.searchResult.map((user, index) => 
                        <UserDetails 
                            hideJoin={this.props.user.directMessages.includes(user.id)}
                            onClick={this.onJoin} 
                            key={index} user={user} />)
                    : 
                        <Spinner /> 
                }
            </React.Fragment>
        );
    }
}

SearchUsersResult.propTypes = {
    searchResult: PropTypes.array,
    userId: PropTypes.string,
    user: PropTypes.object,
    match: ReactRouterPropTypes.match
};

const mapStateToProps = (state) => ({
    searchResult: state.authentication.searchResult,
    userId: state.authentication.user.id,
    user: state.authentication.user
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUsersResult);