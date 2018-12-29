import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import FormError from './FormError';

class ValidationInput extends Component {
    render() {
        return (
            <React.Fragment>
                <Input 
                        invalid={this.props.errors.length > 0} type={this.props.type} value={this.props.value}
                        name={this.props.name} id={this.props.id} 
                        className={this.props.className}
                        onChange={this.props.onInputChange} />
                {
                    this.props.errors.map((x, index) => 
                        <FormError key={index} message={x()} />
                    )
                }
            </React.Fragment>
        );
    }
}

ValidationInput.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    errors: PropTypes.array,
    onInputChange: PropTypes.func.isRequired,
    className: PropTypes.string
}

ValidationInput.defaultProps = {
    errors: []
}

export default ValidationInput;