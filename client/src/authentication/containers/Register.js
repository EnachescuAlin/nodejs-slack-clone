import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import RegisterForm from '../components/RegisterForm';
import { bindActionCreators } from 'redux';
import { actions } from '../index';
import { connect } from 'react-redux';

class Register extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
                        <RegisterForm onSubmit={this.onRegisterFormSubmit} />
                    </Col>
                </Row>
            </Container>
        );
    }

    onRegisterFormSubmit = (user) => {
        this.props.actions.register(user);
        this.props.history.push('/login');
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(Register);