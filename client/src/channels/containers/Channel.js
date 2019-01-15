import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { bindActionCreators } from 'redux';
import { actions as chatActions } from '../../chat';
import { actions as channelsActions } from '..'; 
import { connect } from 'react-redux';
import Spinner from '../../common/components/Spinner';
import socketEventEmits from '../../sockets';
import Message from '../../chat/components/Message';
import { Scrollbars } from 'react-custom-scrollbars';
import AddMessageForm from '../../chat/components/AddMessageForm';
import OwnerButtons from '../components/OwnerButtons';

class Channel extends Component {
    onAddMessage = (text) => {
        if (text && text.length > 0) {
            var message = {
                text,
                channelId: this.props.match.params.channelId
            };
            var sender = {
                userId: this.props.user.id,
                username: this.props.user.username
            };
            this.props.actions.sendMessageToChannel(this.props.match.params.channelId, message, sender);
            return true;
        }
        return false
    } 

    isOwner = () => this.props.user && this.props.channel && this.props.channel.createdBy === this.props.user.id;

    componentWillMount() {
        this.props.actions.cleanMessages();
        this.props.actions.selectChannel(this.props.match.params.channelId);
        socketEventEmits.getAllMessagesFromChannel(this.props.match.params.channelId);
        this.props.actions.getMessagesFromChannel();
    }

    componentDidUpdate() {
        const { scrollbars } = this.refs;
        scrollbars.scrollTop(scrollbars.getScrollHeight());
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.messages ?
                        <div className="pt-5 mt-4">
                            { this.isOwner() ? <OwnerButtons baseUrl={this.props.match.url}/> : null }
                            <div className="wrapper full-height">
                                <Scrollbars ref="scrollbars">
                                    { this.props.messages.map((message, index) => 
                                        <Message 
                                            isSendByUser={message.sender.userId === this.props.user.id} 
                                            key={index} message={message} />) }
                                </Scrollbars>
                            </div>
                            <AddMessageForm onSubmit={this.onAddMessage} />
                        </div>
                    :
                        <Spinner />
                }
            </React.Fragment>
        );
    }
}

Channel.propTypes = {
    messages: PropTypes.array,
    actions: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match,
    user: PropTypes.object,
    channel: PropTypes.object
}

const mapStateToProps = (state) => ({
    messages: state.chat.messages,
    user: state.authentication.user,
    channel: state.channels.selected
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...channelsActions, ...chatActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);