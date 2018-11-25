import React, { Component } from 'react';
import { Row, Col, Card, CardTitle, CardBody, Button, Label, Form, FormGroup } from 'reactstrap';
import ValidationInput from '../../common/components/ValidationInput';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            loginForm: {
                errors: {
                    username: [
                        () => this.state.loginForm.fields.username.value && this.state.loginForm.fields.username.value.length 
                                || 'Username field is required'
                    ],
                    password: [
                        () => this.state.loginForm.fields.password.value && this.state.loginForm.fields.password.value.length 
                                || 'Password field is required'
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
                isValid: () => !this.state.loginForm.errors.username && !this.state.loginForm.errors.password ||
                                !this.state.loginForm.errors.username.filter(x => typeof x === 'string').length && 
                                !this.state.loginForm.errors.password.filter(x => typeof x === 'string').length 
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

    render() {
        return (
            <Row>
                <Col sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
                    <Card className="shadow-lg p-2 m-2">
                        <CardBody>
                            <CardTitle className="text-center">Login</CardTitle>
                            <Form>
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
                                <FormGroup>
                                    <Button color="primary" size="sm" className="float-right">Login</Button>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Login;