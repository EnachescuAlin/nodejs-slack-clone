import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import { Scrollbars } from 'react-custom-scrollbars';
import { actions as authActions } from '../../authentication';
import { actions as channelActions } from '../../channels';
import { connect } from 'react-redux';
import logo from '../../assets/logo.png';
import PageContent from '../components/PageContent';
import { bindActionCreators } from 'redux';
import Spinner from '../../common/components/Spinner';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Switch, Route } from 'react-router-dom';
import EditProfile from '../../profile/containers/EditProfile';
import requiresAuth from '../../common/components/requiresAuth';
import CreateChannel from '../../channels/containers/CreateChannel';
import SearchByName from '../../channels/components/SearchByName';
import SearchUsersByName from '../../users/components/SearchUsersByName';
import Menu from './Menu';
import socketEventEmits from '../../sockets';
import Channel from '../../channels/containers/Channel';
import requiresOwner from '../../channels/components/requiresOwner';
import PrivateChat from '../../chat/containers/PrivateChat';
import EditChannel from '../../channels/containers/EditChannel';
import InviteParticipants from '../../channels/containers/InviteParticipants';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            backDropActive: () => this.state.openSidebar && window.innerWidth < 768,
            openSidebar: true,
            width: window.innerWidth,
            isSocketConnected: false
        };
    }

    componentWillMount() {
        if (!this.props.user || !this.props.joinedChannels) {
            this.props.actions.getCurrentUser()
                .then(() => {
                this.props.actions.getDirectMessages(this.props.user.directMessages);
                socketEventEmits.connectUser(this.props.user.id);
                    this.props.actions.getJoinedChannels(this.props.user.id)
                        .then(() => {
                            if (!this.state.isSocketConnected) {
                                this.props.joinedChannels.forEach(channel => {
                                    socketEventEmits.subscribeToChannel(channel.id);
                                });
                                this.setState({ isSocketConnected: true });
                            }
                        });
                });
        }
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
                { this.props.user && this.props.joinedChannels && this.props.directMessages ? 
                    <React.Fragment>
                        <Sidebar logo={logo} opened={this.state.openSidebar} onBackDropClick={this.toggleSidebar} backDropActive={this.state.backDropActive()}>
                            <Scrollbars autoHide>
                                <Menu joinedChannels={this.props.joinedChannels} directMessages={this.props.directMessages}/>
                            </Scrollbars>
                        </Sidebar>
                        <PageContent user={this.props.user} onLogoutClick={this.logout} onToggleClick={this.toggleSidebar} fullPage={!this.state.openSidebar}>
                                <Switch>
                                    <Route path='/edit-profile' component={requiresAuth(EditProfile)} />
                                    <Route path='/channels/create' component={requiresAuth(CreateChannel)} />
                                    <Route path='/channels/search' component={requiresAuth(SearchByName)} />
                                    <Route path='/channels/:channelId' exact component={requiresAuth(Channel)} />
                                    <Route path='/users/search' component={requiresAuth(SearchUsersByName)}/>
                                    <Route path='/directMessages/:userId' component={requiresAuth(PrivateChat)} />
                                    <Route path='/channels/:channelId/edit' exact component={requiresOwner(EditChannel)} />
                                    <Route path='/channels/:channelId/invite' exact component={requiresOwner(InviteParticipants)} />
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
    location: ReactRouterPropTypes.location.isRequired,
    joinedChannels: PropTypes.array,
    directMessages: PropTypes.array
}

const mapStateToProps = (state) => {
    return {
        user: state.authentication.user,
        joinedChannels: state.channels.joined,
        directMessages: state.authentication.users,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ ...authActions, ...channelActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);