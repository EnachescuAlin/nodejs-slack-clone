import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Validators from '../../common/validators';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Button, UncontrolledAlert, Input } from 'reactstrap';
import ValidationInput from '../../common/components/ValidationInput';

class ChannelForm extends Component {
    constructor(props) {
        super(props);
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
                        value: this.props.channelDetails ? this.props.channelDetails.name : '',
                        touched: false
                    },
                    description: {
                        value: this.props.channelDetails ? this.props.channelDetails.description : '',
                        touched: false
                    },
                    isPublic: {
                        value: this.props.channelDetails ? this.props.channelDetails.isPublic : false,
                        touched: false
                    }
                },
                isValid: () => Validators.evaluate(this.state.channelForm.errors)
            }
        }
    }

    handleInputChange = (event) => {
        var name = event.target.name;
        var value = event.target.checked || event.target.value;
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
        if (this.props.channelDetails) {
            this.props.onSubmit(this.props.channelDetails.id, channel);
        } else {
            this.props.onSubmit(channel);
        }
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
                            <Input 
                                type="checkbox" name="isPublic" id="is-public" className="custom-control-input"
                                onChange={this.handleInputChange} 
                                checked={this.state.channelForm.fields.isPublic.value} />
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