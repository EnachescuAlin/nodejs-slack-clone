import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormFeedback } from 'reactstrap';

class FormError extends Component {
    render() {
        return (
            <FormFeedback>{this.props.message}</FormFeedback>
        );
    }
}

FormError.propTypes = {
    message: PropTypes.string.isRequired
}

export default FormError;