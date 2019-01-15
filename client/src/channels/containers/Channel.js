import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { bindActionCreators } from 'redux';
import { actions } from '../../chat';
import { connect } from 'react-redux';
import Spinner from '../../common/components/Spinner';
import socketEventEmits from '../../sockets';
import Message from '../../chat/components/Message';
import { Scrollbars } from 'react-custom-scrollbars';
import AddMessageForm from '../../chat/components/AddMessageForm';

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

    componentWillMount() {
        this.props.actions.cleanMessages();
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
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    messages: state.chat.messages,
    user: state.authentication.user
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);