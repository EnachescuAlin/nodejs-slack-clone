import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Validators from '../../common/validators';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Button, UncontrolledAlert } from 'reactstrap';
import ValidationInput from '../../common/components/ValidationInput';

class EditProfileForm extends Component {
    constructor() {
        super();
        this.state = {
            editProfileForm: {
                errors: {
                    username: [
                        () => Validators.required(this.state.editProfileForm.fields.username.value, 'Username field is required'),
                    ],
                    firstname: [
                        () => Validators.required(this.state.editProfileForm.fields.firstname.value, 'First name field is required')
                    ],
                    lastname: [
                        () => Validators.required(this.state.editProfileForm.fields.lastname.value ,'Last name field is required')
                    ],
                    email: [
                        () => Validators.matchRegex(this.state.editProfileForm.fields.email.value, /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 'The email used is invalid')
                    ]
                },
                fields: {
                    username: {
                        value: '',
                        touched: false,
                        changed: false
                    },
                    firstname: {
                        value: '',
                        touched: false,
                        changed: false
                    },
                    lastname: {
                        value: '',
                        touched: false,
                        changed: false
                    },
                    email: {
                        value: '',
                        touched: false,
                        changed: false
                    }
                },
                isValid: () => Validators.evaluate(this.state.editProfileForm.errors)
            }
        };
    }

    componentWillMount() {
        var newState = Object.assign({}, this.state);
        Object.keys(newState.editProfileForm.fields)
            .forEach((key) => { newState.editProfileForm.fields[key].value = this.props.userDetails[key] })
    }

    handleInputChange = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ 
            editProfileForm: { 
                ...this.state.editProfileForm, 
                fields: { 
                    ...this.state.editProfileForm.fields, 
                    [name]: {
                        value, 
                        touched: true,
                        changed: true 
                    } 
                } 
            } 
        });
    }

    handleSubmit = (event) => {
        var user = {
            username: this.state.editProfileForm.fields.username.value,
            firstname: this.state.editProfileForm.fields.firstname.value,
            lastname: this.state.editProfileForm.fields.lastname.value,
            email: this.state.editProfileForm.fields.email.value
        };
        this.props.onSubmit(user)
            .then(() => {
                var state = Object.assign({}, this.state);
                Object.keys(state.editProfileForm.fields).forEach(key => { state.editProfileForm.fields[key].changed = false });
                this.setState(state);
            });
        event.preventDefault();
    }
    
    render() {
        return (
            <Card className="shadow-lg m-4">
                <CardBody>
                    <CardTitle className="text-center">Edit Profile</CardTitle>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <ValidationInput 
                                type="text" name="username" id="username" value={this.props.userDetails.username}
                                onInputChange={this.handleInputChange} 
                                errors={this.state.editProfileForm.fields.username.touched ?
                                    this.state.editProfileForm.errors.username.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="firstname">First Name</Label>
                            <ValidationInput 
                                type="text" name="firstname" id="firstname" value={this.props.userDetails.firstname}
                                onInputChange={this.handleInputChange} 
                                errors={this.state.editProfileForm.fields.firstname.touched ?
                                    this.state.editProfileForm.errors.firstname.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastname">Last Name</Label>
                            <ValidationInput 
                                type="text" name="lastname" id="lastname" value={this.props.userDetails.lastname}
                                onInputChange={this.handleInputChange} 
                                errors={this.state.editProfileForm.fields.lastname.touched ?
                                    this.state.editProfileForm.errors.lastname.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <ValidationInput 
                                type="email" name="email" id="email" value={this.props.userDetails.email}
                                onInputChange={this.handleInputChange} 
                                errors={this.state.editProfileForm.fields.email.touched ?
                                    this.state.editProfileForm.errors.email.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        {
                            this.props.serverFeedback ? 
                            <UncontrolledAlert color={this.props.serverFeedback.color}>
                                {this.props.serverFeedback.message}
                            </UncontrolledAlert> : null

                        }
                        <FormGroup className="float-right">
                            <Button outline className="mr-1" onClick={this.props.onCancel}>Cancel</Button>
                            <Button outline disabled={!this.state.editProfileForm.isValid()} color="primary">Save Changes</Button>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}

EditProfileForm.propTypes = {
    serverFeedback: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    userDetails: PropTypes.object.isRequired
};

EditProfileForm.defaultProps = {
    userDetails: {}
}

export default EditProfileForm;