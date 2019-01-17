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

class PrivateChat extends Component {
    onAddMessage = (text) => {
        if (text && text.length > 0) {
            var message = {
                text,
                receiverId: this.props.match.params.userId
            };
            var sender = {
                userId: this.props.user.id,
                username: this.props.user.username
            };
            this.props.actions.sendMessageToUser(message, sender);
            return true;
        }
        return false
    } 

    componentWillMount() {
        if (this.props.user) {
            this.props.actions.cleanPrivateMessages(this.props.match.params.userId);
            socketEventEmits.getAllMessagesFromUser({receiverId: this.props.match.params.userId, senderId: this.props.user.id});
            this.props.actions.getMessagesFromUser();
        }
    }

    componentDidUpdate() {
        const { scrollbars } = this.refs;
        if (scrollbars) {
            scrollbars.scrollTop(scrollbars.getScrollHeight());
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.private && this.props.private.messages ?
                        <div className="pt-5 mt-4">
                            <div className="wrapper full-height">
                                <Scrollbars ref="scrollbars">
                                    { this.props.private.messages.map((message, index) => 
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

PrivateChat.propTypes = {
    private: PropTypes.object,
    actions: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match,
    user: PropTypes.object
}

const mapStateToProps = (state, ownProps) => ({
    private: state.chat.private[ownProps.match.params.userId],
    user: state.authentication.user
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateChat);