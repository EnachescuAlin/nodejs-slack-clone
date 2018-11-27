import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LoginForm from '../components/LoginForm';
import { bindActionCreators } from 'redux';
import { actions } from '../index';
import { connect } from 'react-redux';
import { TOKEN_KEY } from '../../constants';
import PropTypes from 'prop-types';

class Login extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
                        <LoginForm onSubmit={this.onLoginFormSubmit} />
                    </Col>
                </Row>
            </Container>
        );
    }

    onLoginFormSubmit = (username, password) => {
        this.props.actions.login(username, password);
        this.props.history.push("/");
    }
}

Login.propTypes = {
    token: PropTypes.string,
    actions: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        token: state.authentication.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);