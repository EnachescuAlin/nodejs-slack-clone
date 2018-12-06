import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarHeader from './SidebarHeader';

class Sidebar extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="wrapper">
                    <nav className={`sidebar ${this.props.opened ? '' : 'hide'}`}>
                        <SidebarHeader>
                            <img src={this.props.logo} className="logo-small"/>
                        </SidebarHeader>
                        {this.props.children}
                    </nav>
                </div>
                {this.props.backDropActive ? <div className="overlay" onClick={this.props.onBackDropClick}></div> : null }
            </React.Fragment>
        );
    }
}

Sidebar.propTypes = {
    opened: PropTypes.bool,
    children: PropTypes.element,
    logo: PropTypes.any.isRequired,
    backDropActive: PropTypes.bool,
    onBackDropClick: PropTypes.func.isRequired
};

export default Sidebar;