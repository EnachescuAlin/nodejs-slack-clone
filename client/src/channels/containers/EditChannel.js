import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { actions } from '..';
import { connect } from 'react-redux';
import ChannelForm from "../components/ChannelForm";
import Spinner from '../../common/components/Spinner';

class EditChannel extends Component {
    constructor() {
        super();
        this.state = {};
    }

    cancel = () => {
        this.props.history.goBack();
    }

    editChannel = async (id, channel) => {
        await this.props.actions.updateChannel(id, channel);
        if (this.props.errors && this.props.errors.validationError) {
            this.setState({
                serverFeedback: {
                    message: this.props.errors.validationError,
                    color: 'danger'
                }
            });
        } else if (this.props.errors && this.props.errors.notFoundError) {
            this.setState({
                serverFeedback: {
                    message: this.props.errors.notFoundError,
                    color: 'danger'
                }
            });
        }
    }

    render() {
        return (
            <React.Fragment>
            {   
                this.props.channel ?
                    <Container className="mt-5">
                        <Row>
                            <Col sm={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                                <ChannelForm channelDetails={this.props.channel} formTitle="Edit channel" onCancel={this.cancel} onSubmit={this.editChannel}
                                    serverFeedback={this.state.serverFeedback} />
                            </Col>
                        </Row>
                    </Container>
                :
                    <Spinner />
            }
            </React.Fragment>
        );
    }
}

EditChannel.propTypes = {
    actions: PropTypes.object.isRequired,
    errors: PropTypes.object,
    channel: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    errors: state.channels.errors,
    channel: state.channels.selected
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditChannel);