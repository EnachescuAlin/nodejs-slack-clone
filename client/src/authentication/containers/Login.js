import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LoginForm from '../components/LoginForm';
import { bindActionCreators } from 'redux';
import { actions } from '../index';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Login extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
                        <LoginForm onSubmit={this.onLoginFormSubmit} serverValidationErrors={{username: this.props.error, password: this.props.error}} />
                    </Col>
                </Row>
            </Container>
        );
    }

    componentWillMount() {
        if (this.props.isAuthenticated)
            this.props.history.push('/');
    }

    onLoginFormSubmit = async (username, password) => {
        await this.props.actions.login(username, password);
        if (!this.props.error) 
            this.props.history.push("/");
    }
}

Login.propTypes = {
    token: PropTypes.string,
    actions: PropTypes.object.isRequired,
    error: PropTypes.string,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => {
    return {
        token: state.authentication.token,
        error: state.authentication.error,
        isAuthenticated: state.authentication.token && state.authentication.token.length > 0
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);