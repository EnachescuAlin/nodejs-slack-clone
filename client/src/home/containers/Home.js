import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { actions as authActions } from '../../authentication';
import { actions as channelActions } from '../../channels';
import { connect } from 'react-redux';
import logo from '../../assets/logo.png';
import PageContent from '../components/PageContent';
import { bindActionCreators } from 'redux';
import Spinner from '../../common/components/Spinner';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Switch, Route, NavLink } from 'react-router-dom';
import EditProfile from '../../profile/containers/EditProfile';
import requiresAuth from '../../common/components/requiresAuth';
import SubMenu from '../../common/components/SubMenu';
import CreateChannel from '../../channels/containers/CreateChannel';

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
        this.props.actions.getCurrentUser()
            .then(() => {
                this.props.actions.getJoinedChannels(this.props.user.id);
            });
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
                                    <ListGroupItem tag={NavLink} to="/" className="menu-item">Home</ListGroupItem>
                                    <ListGroupItem tag={SubMenu} subMenuTitle="Channels">
                                        <ListGroupItem tag={NavLink} to="/channels/create" className="menu-item">Create new channel</ListGroupItem>
                                        { 
                                            this.props.joinedChannels.map((channel, index) => 
                                                <ListGroupItem tag={NavLink} key={index} to={`/channels/${channel.id}`} className="menu-item">{channel.name}</ListGroupItem>
                                            )
                                        }
                                    </ListGroupItem>
                                </ListGroup>
                            </Scrollbars>
                        </Sidebar>
                        <PageContent user={this.props.user} onLogoutClick={this.logout} onToggleClick={this.toggleSidebar} fullPage={!this.state.openSidebar}>
                            <Switch>
                                <Route path='/edit-profile' component={requiresAuth(EditProfile)} />
                                <Route path='/channels/create' component={requiresAuth(CreateChannel)}/>
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
    history: ReactRouterPropTypes.history.isRequired,
    joinedChannels: PropTypes.array
}

const mapStateToProps = (state) => {
    return {
        user: state.authentication.user,
        joinedChannels: state.channels.joined
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ ...authActions, ...channelActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);