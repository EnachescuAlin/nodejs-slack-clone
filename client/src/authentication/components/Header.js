import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import Logo from '../../common/components/Logo';

class Header extends Component {
    render() {
        return (
            <Row>
                <Col sm={{ size: 8, offset: 2 }} md={{ size: 4, offset: 4 }}>
                    <Logo />
                </Col>
            </Row>
        );
    }
}

export default Header;