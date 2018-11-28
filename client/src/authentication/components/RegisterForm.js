import React, { Component } from 'react'
import { Card, CardImg, CardTitle, CardBody, Button, Label, Form, FormGroup } from 'reactstrap';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import ValidationInput from '../../common/components/ValidationInput';
import logo from '../../assets/logo.png';
import Validators from '../../common/validators';

class RegisterForm extends Component {
    constructor() {
        super();
        this.state = {
            registerForm: {
                errors: {
                    username: [
                        () => Validators.required(this.state.registerForm.fields.username.value, 'Username field is required'),
                        () => Validators.serverError(this.props.serverValidationErrors.username, this.state.registerForm.fields.username.changed) 
                    ],
                    password: [
                        () => Validators.required(this.state.registerForm.fields.password.value, 'Password field is required')
                    ],
                    confirmPassword: [
                        () => Validators.matchValue(this.state.registerForm.fields.confirmPassword.value, this.state.registerForm.fields.password.value, 'Password and Confirm Password fields must match'),
                    ],
                    firstName: [
                        () => Validators.required(this.state.registerForm.fields.firstName.value, 'First name field is required')
                    ],
                    lastName: [
                        () => Validators.required(this.state.registerForm.fields.lastName.value ,'Last name field is required')
                    ],
                    email: [
                        () => Validators.matchRegex(this.state.registerForm.fields.email.value, /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 'The email used is invalid')
                    ]
                },
                fields: {
                    username: { 
                        value: '',
                        touched: false,
                        changed: false
                    },
                    password: { 
                        value: '',
                        touched: false,
                        changed: false
                    },
                    confirmPassword: { 
                        value: '',
                        touched: false,
                        changed: false
                    },
                    email: { 
                        value: '',
                        touched: false,
                        changed: false
                    },
                    firstName: { 
                        value: '',
                        touched: false,
                        changed: false
                    },
                    lastName: { 
                        value: '',
                        touched: false,
                        changed: false
                    }
                },
                isValid: () => Object.keys(this.state.registerForm.errors)
                                    .map(key => this.state.registerForm.errors[key].filter(x => typeof x() == 'string').length == 0)
                                    .reduce((prev, curr) => prev && curr, true)
            }
        }
    }

    handleInputChange = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ 
            registerForm: { 
                ...this.state.registerForm, 
                fields: { 
                    ...this.state.registerForm.fields, 
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
            username: this.state.registerForm.fields.username.value,
            password: this.state.registerForm.fields.password.value,
            firstName: this.state.registerForm.fields.firstName.value,
            lastName: this.state.registerForm.fields.lastName.value,
            email: this.state.registerForm.fields.email.value
        };
        this.props.onSubmit(user)
            .then(() => {
                var state = Object.assign({}, this.state);
                Object.keys(state.registerForm.fields).forEach(key => { state.registerForm.fields[key].changed = false });
                this.setState(state);
            });
        event.preventDefault();
    } 

    goToLoginPage = () => { this.props.history.push('/login'); }

    render() {
        return ( 
            <Card className="shadow-lg m-4">
                <CardImg top width="100%" src={logo} />
                <CardBody>
                    <CardTitle className="text-center">Register</CardTitle>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <ValidationInput 
                                type="text" name="username" id="username" 
                                onInputChange={this.handleInputChange} 
                                errors={this.state.registerForm.fields.username.touched ?
                                    this.state.registerForm.errors.username.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <ValidationInput 
                                type="text" name="firstName" id="firstName" 
                                onInputChange={this.handleInputChange} 
                                errors={this.state.registerForm.fields.firstName.touched ?
                                    this.state.registerForm.errors.firstName.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <ValidationInput 
                                type="text" name="lastName" id="lastName" 
                                onInputChange={this.handleInputChange} 
                                errors={this.state.registerForm.fields.lastName.touched ?
                                    this.state.registerForm.errors.lastName.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <ValidationInput 
                                type="email" name="email" id="email" 
                                onInputChange={this.handleInputChange} 
                                errors={this.state.registerForm.fields.email.touched ?
                                    this.state.registerForm.errors.email.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <ValidationInput 
                                type="password" name="password" id="password" 
                                onInputChange={this.handleInputChange}
                                errors={this.state.registerForm.fields.password.touched ? 
                                    this.state.registerForm.errors.password.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmPassword">Confirm Password</Label>
                            <ValidationInput 
                                type="password" name="confirmPassword" id="confirmPassword" 
                                onInputChange={this.handleInputChange}
                                errors={this.state.registerForm.fields.confirmPassword.touched ? 
                                    this.state.registerForm.errors.confirmPassword.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup className="float-right">
                            <Button color="secondary" size="sm" className="mr-1" onClick={this.goToLoginPage}>Login</Button>
                            <Button disabled={!this.state.registerForm.isValid()} color="primary" size="sm">Register</Button>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}

RegisterForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    serverValidationErrors: PropTypes.object
}

export default withRouter(RegisterForm);