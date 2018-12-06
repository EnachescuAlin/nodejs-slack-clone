import React, { Component } from 'react';
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
                    <DropdownItem>Test</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }
}

export default Account;