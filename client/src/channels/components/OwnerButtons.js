import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

class OwnerButtons extends Component {
    render() {
        return (
            <div className="py-2 shadow">
                <Button tag={NavLink} className="ml-3 mr-auto" to={`${this.props.baseUrl}/edit`} outline color="danger">Edit</Button>
            </div>
        );
    }
}

OwnerButtons.propTypes = {
    baseUrl: PropTypes.string.isRequired
}

export default OwnerButtons;