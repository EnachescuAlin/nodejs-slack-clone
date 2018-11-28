import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import FormError from './FormError';

class ValidationInput extends Component {
    render() {
        return (
            <React.Fragment>
                <Input 
                        invalid={this.props.errors.length > 0} type={this.props.type} 
                        name={this.props.name} id={this.props.id} 
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
    errors: PropTypes.array,
    onInputChange: PropTypes.func.isRequired
}

export default ValidationInput;