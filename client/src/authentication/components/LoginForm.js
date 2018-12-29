import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Card, CardImg, CardTitle, CardBody, Button, Label, Form, FormGroup } from 'reactstrap';
import ValidationInput from '../../common/components/ValidationInput';
import logo from '../../assets/logo.png';
import Validators from '../../common/validators';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            loginForm: {
                errors: {
                    username: [
                        () => Validators.required(this.state.loginForm.fields.username.value, 'Username field is required'),
                        () => Validators.serverError(this.props.serverValidationErrors.username, this.state.loginForm.fields.username.changed)
                    ],
                    password: [
                        () => Validators.required(this.state.loginForm.fields.password.value, 'Password field is required'),
                        () => Validators.serverError(this.props.serverValidationErrors.password, this.state.loginForm.fields.password.changed)
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
                    }
                },
                isValid: () => Object.keys(this.state.loginForm.errors)
                                .map(key => this.state.loginForm.errors[key].filter(x => typeof x() == 'string').length == 0)
                                .reduce((prev, current) => prev && current, true) 
            }
        }
    }

    handleInputChange = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ 
            loginForm: { 
                ...this.state.loginForm, 
                fields: { 
                    ...this.state.loginForm.fields, 
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
        var username = this.state.loginForm.fields.username.value;
        var password = this.state.loginForm.fields.password.value;
        this.props.onSubmit(username, password)
            .then(() => {
                var state = Object.assign({}, this.state);
                Object.keys(state.loginForm.fields).forEach(key => { state.loginForm.fields[key].changed = false });
                this.setState(state);
            });
        event.preventDefault();
    }

    goToRegisterPage = () => { this.props.history.push('/register'); }

    render() {
        return (
            <Card className="shadow-lg m-4">
                <CardImg top width="100%" src={logo} />
                <CardBody>
                    <CardTitle className="text-center">Login</CardTitle>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <ValidationInput 
                                type="text" name="username" id="username" 
                                value={this.state.loginForm.fields.username.value}
                                onInputChange={this.handleInputChange} 
                                errors={this.state.loginForm.fields.username.touched ?
                                    this.state.loginForm.errors.username.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <ValidationInput 
                                type="password" name="password" id="password"
                                value={this.state.loginForm.fields.password.value} 
                                onInputChange={this.handleInputChange}
                                errors={this.state.loginForm.fields.password.touched ? 
                                    this.state.loginForm.errors.password.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup className="float-right">
                            <Button color="secondary" size="sm" className="mr-1" onClick={this.goToRegisterPage}>Register</Button>
                            <Button disabled={!this.state.loginForm.isValid()} color="primary" size="sm">Login</Button>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    serverValidationErrors: PropTypes.object
}

export default withRouter(LoginForm);