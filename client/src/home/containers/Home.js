import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import logo from '../../assets/logo.png';
import PageContent from '../components/PageContent';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            backDropActive: () => this.state.openSidebar && window.innerWidth < 768,
            openSidebar: true,
            width: window.innerWidth
        };
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        this.setState({
            width: window.innerWidth,
            openSidebar: window.innerWidth >= 768
        });
    }

    toggleSidebar = () => {
        this.setState({
            openSidebar: !this.state.openSidebar
        });
    }

    render() {
        return (
            <React.Fragment>
                <Sidebar logo={logo} opened={this.state.openSidebar} onBackDropClick={this.toggleSidebar} backDropActive={this.state.backDropActive()}>
                    <Scrollbars autoHide>
                        <ListGroup className="menu">
                            <ListGroupItem tag="a" href="/" className="menu-item">Home</ListGroupItem>
                            <ListGroupItem tag="a" href="/" className="menu-item">About</ListGroupItem>
                            <ListGroupItem tag="a" href="/" className="menu-item">Credits</ListGroupItem>
                        </ListGroup>
                    </Scrollbars>
                </Sidebar>
                <PageContent onToggleClick={this.toggleSidebar} fullPage={!this.state.openSidebar} />
            </React.Fragment>
        );
    }
}

export default Home;