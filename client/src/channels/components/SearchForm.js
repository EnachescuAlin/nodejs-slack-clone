import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { InputGroup, Input, InputGroupAddon, Button, Form } from 'reactstrap';
import { withRouter } from 'react-router';

class SearchForm extends Component {
    constructor() {
        super();
        this.state = {
            searchValue: ''
        }
    }

    render() {
        return (
            <Form onSubmit={this.search}>
                <InputGroup className="mt-5">
                    <Input onChange={this.onChange} bsSize="lg" type="search" placeholder="Search Channels by Name" />
                    <InputGroupAddon addonType="append">
                        <Button>
                            <i className="fas fa-search"></i>
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
            </Form>
        );
    }

    search = () => {
        if (this.state.searchValue)
            this.props.history.push(`/channels/search/${this.state.searchValue}`);
        event.preventDefault();
    }

    onChange = (event) => {
        this.setState({
            searchValue: event.target.value
        });
    }
}

SearchForm.propTypes = {
    history: ReactRouterPropTypes.history,
}

export default withRouter(SearchForm);