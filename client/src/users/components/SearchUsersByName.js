import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchUsersForm from './SearchUsersForm';
import { Container, Row, Col } from 'reactstrap';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Route } from 'react-router-dom';
import SearchUsersResult from '../containers/SearchUsersResult';

class SearchUsersByName extends Component {
    render() {
        return (
            <Container className="mt-5">
                <Row>
                    <Col sm={{ size: 10, offset: 1 }}>
                        <SearchUsersForm />
                    </Col>
                </Row>
                <Route path={`${this.props.match.path}/:name`} component={SearchUsersResult} />
            </Container>
        );
    }
}

SearchUsersByName.propTypes = {
    match: ReactRouterPropTypes.match
}

export default SearchUsersByName;