import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from '../../assets/logo.png';

class Logo extends Component {
    render() {
        return (
            <img src={logo} className="img-fluid" width={this.props.width} height={this.props.height} />
        );
    }
}

Logo.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
}

export default Logo;