import React, { Component } from 'react';
import { Input, Dropdown, DropdownToggle, DropdownMenu, Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

class AutoComplete extends Component {
    constructor() {
        super();
        this.state = {
            searchValue: '',
            toggleResults: false
        };
    }

    handleSearchChange = (event) => {
        var value = event.target.value;
        if (value && value.length >= 3) {
            this.props.onSearchChange(value)
                .then(() => {
                    this.setState({ searchValue: value, toggleResults: true });
                });
        } else {
            this.setState({ searchValue: value, toggleResults: false });
        }
    }

    render() {
        const ResultItem = this.props.itemComponent;
        return (
            <Dropdown className="mt-5" isOpen={this.state.toggleResults} toggle={this.handleSearchChange}>
                <DropdownToggle tag="span">
                    <Input 
                        value={this.state.searchValue} 
                        onChange={this.handleSearchChange} 
                        bsSize="lg" 
                        type="search" 
                        placeholder="Search Users By username" />
                </DropdownToggle>
                <DropdownMenu className="autocomplete">
                    { 
                        this.props.searchResults && this.props.searchResults.length ? 
                            this.props.searchResults.map((result, index) => 
                                <ResultItem key={index} value={result} onClick={this.props.onClickElement} />) 
                        : 
                        <div className="p-2">No results available</div> 
                    }
                </DropdownMenu>
            </Dropdown>
        );
    }
}

AutoComplete.propTypes = {
    searchResults: PropTypes.array,
    onSearchChange: PropTypes.func.isRequired,
    itemComponent: PropTypes.any,
    onClickElement: PropTypes.func.isRequired
}

export default AutoComplete;