import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col } from 'reactstrap';

class ChannelDetails extends Component {
    handleClick = () => {
        this.props.onJoin(this.props.channel.id);
    }

    render() {
        return (
            <Row className="px-5 m-4">
                <Col sm={{ size: 12 }}>
                    <Card className="p-3 shadow-lg">
                        <CardTitle>{this.props.channel.name}</CardTitle>
                        <CardBody>
                            <Row>
                                <Col sm={{ size: 10 }}>
                                    <CardText className="text-truncate">{this.props.channel.description}</CardText>
                                </Col>
                                { 
                                    this.props.channel.isPublic && !this.props.hideJoin 
                                    ? 
                                        <Col sm={{ size: 1 }}><Button onClick={this.handleClick}>Join</Button></Col> 
                                    : 
                                    null 
                                }
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

ChannelDetails.propTypes = {
    channel: PropTypes.object.isRequired,
    onJoin: PropTypes.func.isRequired,
    hideJoin: PropTypes.bool.isRequired
}

export default ChannelDetails;
