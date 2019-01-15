import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Message extends Component {
    getUserClassnames = () => {
        return this.props.isSendByUser ? 'ml-auto bg-primary' : 'mr-auto bg-secondary';
    }

    render() {
        return (
            <div className={`p-3 m-4 border shadow-lg text-white rounded-pill w-75 ${this.getUserClassnames()}`}>
                <div className="font-weight-bold">{this.props.message.sender.username}</div>
                {this.props.message.text}
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.object.isRequired,
    isSendByUser: PropTypes.bool
}

export default Message;