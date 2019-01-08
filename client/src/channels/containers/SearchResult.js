import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../common/components/Spinner';
import ChannelDetails from '../components/ChannelDetails';
import { actions } from '..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactRouterPropTypes from 'react-router-prop-types';

class SearchResult extends Component {
    componentWillMount() {
        this.props.actions.searchChannels(this.props.match.params.name);
    }

    onJoin = async (channelId) => {
        await this.props.actions.joinChannel(channelId, this.props.userId);
    }
    
    render() {
        return (
            <React.Fragment>
                { 
                    this.props.searchResult ?
                        this.props.searchResult.map((channel, index) => 
                        <ChannelDetails 
                            hideJoin={channel.members.includes(this.props.userId)}
                            onJoin={this.onJoin} 
                            key={index} channel={channel} />)
                    : 
                        <Spinner /> 
                }
            </React.Fragment>
        );
    }
}

SearchResult.propTypes = {
    searchResult: PropTypes.array,
    userId: PropTypes.string,
    match: ReactRouterPropTypes.match
};

const mapStateToProps = (state) => ({
    searchResult: state.channels.searchResult,
    userId: state.authentication.user.id
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);