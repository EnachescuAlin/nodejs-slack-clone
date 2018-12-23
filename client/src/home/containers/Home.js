import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { actions } from '../../authentication/index';
import { connect } from 'react-redux';
import logo from '../../assets/logo.png';
import PageContent from '../components/PageContent';
import { bindActionCreators } from 'redux';
import Spinner from '../../common/components/Spinner';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Switch, Route } from 'react-router-dom';
import EditProfile from '../../profile/containers/EditProfile';
import requiresAuth from '../../common/components/requiresAuth';
import SubMenu from '../../common/components/SubMenu';

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
        this.props.actions.getCurrentUser();
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

    logout = () => {
        this.props.actions.logout()
            .then(() => { this.props.history.push('/login') });
    }

    render() {
        return (
            <React.Fragment>
                { this.props.user ? 
                    <React.Fragment>
                        <Sidebar logo={logo} opened={this.state.openSidebar} onBackDropClick={this.toggleSidebar} backDropActive={this.state.backDropActive()}>
                            <Scrollbars autoHide>
                                <ListGroup className="menu">
                                    <ListGroupItem tag="a" href="/" className="menu-item">Home</ListGroupItem>
                                    <ListGroupItem tag="a" href="/" className="menu-item">About</ListGroupItem>
                                    <ListGroupItem tag={SubMenu} subMenuTitle="Credits">
                                        <ListGroupItem tag="a" href="/" className="menu-item">Home</ListGroupItem>
                                        <ListGroupItem tag="a" href="/" className="menu-item">About</ListGroupItem>
                                    </ListGroupItem>
                                </ListGroup>
                            </Scrollbars>
                        </Sidebar>
                        <PageContent user={this.props.user} onLogoutClick={this.logout} onToggleClick={this.toggleSidebar} fullPage={!this.state.openSidebar}>
                            <Switch>
                                <Route path='/edit-profile' component={requiresAuth(EditProfile)} />
                            </Switch>
                        </PageContent>
                    </React.Fragment> 
                : 
                    <Spinner />
                }
            </React.Fragment>
        );
    }
}

Home.propTypes = {
    actions: PropTypes.object.isRequired,
    user: PropTypes.object,
    history: ReactRouterPropTypes.history.isRequired
}

const mapStateToProps = (state) => {
    return {
        user: state.authentication.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);