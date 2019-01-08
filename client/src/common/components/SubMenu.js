import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, ListGroupItem } from 'reactstrap';

class SubMenu extends Component {
    constructor() {
        super();
        this.state = {
            isOpened: true
        }
    }

    toggle = () => {
        this.setState({isOpened: !this.state.isOpened});
    }

    render() {
        return (
            <React.Fragment>
                <ListGroupItem className="menu-item" onClick={this.toggle}>
                    { this.props.logo ? <i className={`mr-2 fas fa-${this.props.logo}`}></i> : null }
                    {this.props.subMenuTitle}
                    <i className={`ml-2 fas ${this.state.isOpened ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                </ListGroupItem>
                <Collapse className="sub-menu" isOpen={this.state.isOpened}>
                    {this.props.children}
                </Collapse>
            </React.Fragment>
        );
    }
}

SubMenu.propTypes = {
    subMenuTitle: PropTypes.string.isRequired,
    logo: PropTypes.string,
    children: PropTypes.any
}

export default SubMenu;