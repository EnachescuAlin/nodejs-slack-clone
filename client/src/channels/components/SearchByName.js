import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchForm from './SearchForm';
import { Container, Row, Col } from 'reactstrap';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Route } from 'react-router-dom';
import SearchResult from '../containers/SearchResult';

class SearchByName extends Component {
    render() {
        return (
            <Container className="mt-5">
                <Row>
                    <Col sm={{ size: 10, offset: 1 }}>
                        <SearchForm />
                    </Col>
                </Row>
                <Route path={`${this.props.match.path}/:name`} component={SearchResult} />
            </Container>
        );
    }
}

SearchByName.propTypes = {
    match: ReactRouterPropTypes.match
}

export default SearchByName;