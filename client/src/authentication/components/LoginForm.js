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
                        () => Validators.required(this.state.loginForm.fields.username.value, 'Username field is required')
                    ],
                    password: [
                        () => Validators.required(this.state.loginForm.fields.password.value, 'Password field is required')
                    ]
                },
                fields: {
                    username: { 
                        value: '',
                        touched: false
                    },
                    password: { 
                        value: '',
                        touched: false
                    }
                },
                isValid: () => Object.keys(this.state.loginForm.errors)
                                .map(key => this.state.loginForm.errors[key].filter(x => typeof x() == 'string').length == 0)
                                .reduce((prev, curr) => prev && curr, true) 
            }
        }
    }

    handleInputChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ 
            loginForm: { 
                ...this.state.loginForm, 
                fields: { 
                    ...this.state.loginForm.fields, 
                    [name]: {
                        value, 
                        touched: true 
                    } 
                } 
            } 
        });
    }

    handleSubmit = (event) => {
        let username = this.state.loginForm.fields.username.value;
        let password = this.state.loginForm.fields.password.value;
        this.props.onSubmit(username, password);
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
                                onInputChange={this.handleInputChange} 
                                errors={this.state.loginForm.fields.username.touched ?
                                    this.state.loginForm.errors.username.filter(x => typeof x() === 'string') : []} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <ValidationInput 
                                type="password" name="password" id="password" 
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
    onSubmit: PropTypes.func.isRequired
}

export default withRouter(LoginForm);