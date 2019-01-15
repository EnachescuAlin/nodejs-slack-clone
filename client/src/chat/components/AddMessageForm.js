import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, InputGroup, InputGroupAddon, Button } from 'reactstrap';

class AddMessageForm extends Component {
    constructor() {
        super();
        this.state = {
            text: ''
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.props.onSubmit(this.state.text)) {
            this.setState({
                text: ''
            });
        }
    }

    handleInputChange = (event) => {
        this.setState({
            text: event.target.value
        });
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit} className="w100 mx-2 mb-2">
                <InputGroup>
                    <Input value={this.state.text} onChange={this.handleInputChange} type="text" bsSize="lg" />
                    <InputGroupAddon addonType="append">
                        <Button><i className="fas fa-comments"></i></Button>
                    </InputGroupAddon>
                </InputGroup>
            </Form>
        );
    }
}

AddMessageForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default AddMessageForm;