import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import RegisterForm from '../components/RegisterForm';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { actions } from '../index';
import { connect } from 'react-redux';

class Register extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
                        <RegisterForm onSubmit={this.onRegisterFormSubmit} serverValidationErrors={{username: this.props.error}} />
                    </Col>
                </Row>
            </Container>
        );
    }

    componentWillMount() {
        if (this.props.isAuthenticated)
            this.props.history.push('/');
    }

    onRegisterFormSubmit = async (user) => {
        await this.props.actions.register(user);
        if (!this.props.error)
            this.props.history.push('/login');
    }
}

Register.propTypes = {
    actions: PropTypes.object.isRequired,
    error: PropTypes.string,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => {
    return {
        error: state.authentication.error,
        isAuthenticated: state.authentication.token && state.authentication.token.length > 0
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);