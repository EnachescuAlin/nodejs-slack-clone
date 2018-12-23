import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, ListGroupItem } from 'reactstrap';

class SubMenu extends Component {
    constructor() {
        super();
        this.state = {
            isOpened: false
        }
    }

    toggle = () => {
        this.setState({isOpened: !this.state.isOpened});
    }

    render() {
        return (
            <React.Fragment>
                <ListGroupItem className="menu-item" onClick={this.toggle}>
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
    children: PropTypes.any
}

export default SubMenu;