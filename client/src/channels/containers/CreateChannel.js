import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { actions } from '..';
import { connect } from 'react-redux';
import ChannelForm from "../components/ChannelForm";

class CreateChannel extends Component {
    constructor() {
        super();
        this.state = {};
    }

    cancel = () => {
        this.props.history.goBack();
    }

    createChannel = async (channel) => {
        await this.props.actions.addChannel(channel);
        if (this.props.errors && this.props.errors.validationError) {
            this.setState({
                serverFeedback: {
                    message: this.props.errors.validationError,
                    color: 'danger'
                }
            });
        } else {
            this.setState({
                serverFeedback: {
                    message: "Channel successfully created!",
                    color: 'success'
                }
            });
        }
    }

    render() {
        return (
            <Container className="mt-5">
                <Row>
                    <Col sm={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                        <ChannelForm formTitle="Create a new channel" onCancel={this.cancel} onSubmit={this.createChannel}
                            serverFeedback={this.state.serverFeedback} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

CreateChannel.propTypes = {
    actions: PropTypes.object.isRequired,
    errors: PropTypes.object
};

const mapStateToProps = (state) => ({
    errors: state.channels.errors
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateChannel);