import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavbarToggler } from 'reactstrap';
import Account from './Account';

class PageContent extends Component {
    render() {
        return (
            <div className={`page-content ${this.props.fullPage ? 'full-page' : ''}`}>
                <Navbar color="dark" dark>
                    <NavbarToggler onClick={this.props.onToggleClick} />
                    <Account onLogoutClick={this.props.onLogoutClick} user={this.props.user} />
                </Navbar>
                {this.props.children}
            </div>
        );
    }
}

PageContent.propTypes = {
    children: PropTypes.any,
    onToggleClick: PropTypes.func.isRequired,
    fullPage: PropTypes.bool.isRequired,
    user: PropTypes.object,
    onLogoutClick: PropTypes.func.isRequired
};

export default PageContent;