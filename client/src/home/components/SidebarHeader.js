import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SidebarHeader extends Component {
    render() {
        return (
            <div className="sidebar-header">
                {this.props.children}
            </div>
        ); 
    }
}

SidebarHeader.propTypes = {
    children: PropTypes.any
};

export default SidebarHeader;