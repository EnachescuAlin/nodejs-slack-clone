import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Validators from '../../common/validators';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Button, UncontrolledAlert } from 'reactstrap';
import ValidationInput from '../../common/components/ValidationInput';

class ChannelForm extends Component {
    constructor() {
        super();
        this.state = {
            channelForm: {
                errors: {
                    name: [
                        () => Validators.required(this.state.channelForm.fields.name.value, 'Name field is required')
                    ],
                    description: [
                        () => Validators.required(this.state.channelForm.fields.description.value, 'Description field is required')
                    ]
                },
                fields: {
                    name: {
                        value: '',
                        touched: false
                    },
                    description: {
                        value: '',
                        touched: false
                    },
                    isPublic: {
                        value: false,
                        touched: false
                    }
                },
                isValid: () => Validators.evaluate(this.state.channelForm.errors)
            }
        }
    }

    componentWillMount() {
        if (this.props.channelDetails) {
            var newState = Object.assign({}, this.state);
            Object.keys(newState.channelForm.fields)
                .forEach((key) => { newState.channelForm.fields[key].value = this.props.channelDetails[key] });
            this.setState(newState);
        }
    }

    handleInputChange = (event) => {
        var name = event.target.name;
        var value = event.target.value || event.target.checked;
        this.setState({ 
            channelForm: { 
                ...this.state.channelForm, 
                fields: { 
                    ...this.state.channelForm.fields, 
                    [name]: {
                        value, 
                        touched: true
                    } 
                } 
            } 
        });
    }

    handleSubmit = (event) => {
        var channel = {
            name: this.state.channelForm.fields.name.value,
            description: this.state.channelForm.fields.description.value,
            isPublic: this.state.channelForm.fields.isPublic.value
        };
        this.props.onSubmit(channel);
        event.preventDefault();
    }

    render() {
        return (
            <Card className="shadow-lg m-4">
                <CardBody>
                    <CardTitle className="text-center">{this.props.formTitle}</CardTitle>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <ValidationInput 
                                type="text" name="name" id="name"
                                value={this.state.channelForm.fields.name.value} 
                                onInputChange={this.handleInputChange} 
                                errors={this.state.channelForm.fields.name.touched ?
                                    this.state.channelForm.errors.name.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <ValidationInput 
                                type="textarea" name="description" id="description" 
                                value={this.state.channelForm.fields.description.value}
                                onInputChange={this.handleInputChange} 
                                errors={this.state.channelForm.fields.description.touched ?
                                    this.state.channelForm.errors.description.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <div className="custom-control custom-checkbox">
                            <ValidationInput 
                                type="checkbox" name="isPublic" id="is-public" className="custom-control-input"
                                onInputChange={this.handleInputChange} />
                            <Label className="custom-control-label" for="is-public">Public</Label>
                        </div>
                        {
                            this.props.serverFeedback ? 
                            <UncontrolledAlert color={this.props.serverFeedback.color}>
                                {this.props.serverFeedback.message}
                            </UncontrolledAlert> : null

                        }
                        <FormGroup className="float-right">
                            <Button outline className="mr-1" onClick={this.props.onCancel}>Cancel</Button>
                            <Button outline disabled={!this.state.channelForm.isValid()} color="primary">Submit</Button>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}

ChannelForm.propTypes = {
    channelDetails: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    serverFeedback: PropTypes.object,
    formTitle: PropTypes.string.isRequired
}

export default ChannelForm;