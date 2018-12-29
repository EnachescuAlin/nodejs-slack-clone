import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { actions } from '../../authentication';
import { connect } from 'react-redux';
import { Container, Row, Col } from "reactstrap";
import EditProfileForm from '../components/EditProfileForm';

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <Container className="mt-5">
                <Row>
                    <Col sm={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                        <EditProfileForm userDetails={this.props.user} onCancel={this.cancel} 
                            serverFeedback={this.state.serverFeedback} onSubmit={this.saveChanges} />
                    </Col>
                </Row>
            </Container>
        );
    }

    cancel = () => {
        this.props.history.goBack();
    }

    saveChanges = async (user) => {
        await this.props.actions.updateProfile(this.props.user.id, user);
        if (this.props.error) {
            this.setState({
                serverFeedback: {
                    message: this.props.error,
                    color: 'danger'
                }
            });
        } else {
            this.setState({
                serverFeedback: {
                    message: 'Changes were saved!',
                    color: 'success'
                }
            });
        }
    }
}

EditProfile.propTypes = {
    actions: PropTypes.object.isRequired,
    error: PropTypes.string,
    user: PropTypes.object
}

const mapStateToProps = (state) => {
    return {
        error: state.authentication.error,
        user: state.authentication.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);