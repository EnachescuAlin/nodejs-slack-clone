import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Account extends Component {
    constructor() {
        super();
        this.state = {
            dropdownOpen: false
        }
    }

    toggleDropdownState = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        return (
            <Dropdown className="ml-auto" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdownState}>
                <DropdownToggle>
                    <i className="fas fa-user-circle fa-2x fa-inverse"></i>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>{this.props.user.username}</DropdownItem>
                    <DropdownItem header>{`Hello ${this.props.user.firstname}, ${this.props.user.lastname}`}</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.props.onLogoutClick}>Logout</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }
}

Account.propTypes = {
    user: PropTypes.object,
    onLogoutClick: PropTypes.func.isRequired
}

export default Account;