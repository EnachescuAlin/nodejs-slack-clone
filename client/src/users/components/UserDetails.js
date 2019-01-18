import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col } from 'reactstrap';

class UserDetails extends Component {
    handleClick = () => {
        this.props.onClick(this.props.user.id);
    }

    render() {
        return (
            <Row className="px-5 m-4">
                <Col sm={{ size: 12 }}>
                    <Card className="p-3 shadow-lg">
                        <CardTitle>{this.props.user.username}</CardTitle>
                        <CardBody>
                            <Row>
                                <Col sm={{ size: 9 }}>
                                    <CardText className="text-truncate">{this.props.user.firstname}, {this.props.user.lastname}</CardText>
                                </Col>
                                {
                                    !this.props.hideJoin
                                    ?
                                        <Col sm={{ size: 2 }} className="mr-2"><Button onClick={this.handleClick}>Join</Button></Col> 
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

UserDetails.propTypes = {
    user: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    hideJoin: PropTypes.bool.isRequired
}

export default UserDetails;
