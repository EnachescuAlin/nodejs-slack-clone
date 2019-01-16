import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserSearchDetails extends Component {
    handleClick = () => {
        this.props.onClick(this.props.value);
    }

    render() {
        return (
            <div className="p-2 cursor-pointer" onClick={this.handleClick}>{this.props.value.username}</div>
        );
    }
}

UserSearchDetails.propTypes = {
    value: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

export default UserSearchDetails;