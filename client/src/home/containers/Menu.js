import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import SubMenu from '../../common/components/SubMenu';
import { connect } from 'react-redux';

class Menu extends Component {
    render() {
        return (
            <ListGroup className="menu">
                <ListGroupItem tag={SubMenu} logo="users" subMenuTitle="Channels">
                    <ListGroupItem tag={NavLink} to="/channels/create" className="menu-item">
                        <i className="fas fa-plus-circle mr-2"></i>Create new channel
                    </ListGroupItem>
                    <ListGroupItem tag={NavLink} to="/channels/search" className="menu-item">
                        <i className="fas fa-search mr-2"></i>Search channels
                    </ListGroupItem>
                    { 
                        this.props.joinedChannels.map((channel, index) => 
                            <ListGroupItem tag={NavLink} key={index} to={`/channels/${channel.id}`} className="menu-item">
                                #{channel.name}
                                { this.props.notifications.channels && 
                                    this.props.notifications.channels[channel.id] ?
                                        <Badge className="p-2 float-right" color="danger">{this.props.notifications.channels[channel.id]}</Badge>
                                    :
                                        null
                                }
                            </ListGroupItem>
                        )
                    }
                </ListGroupItem>
                <ListGroupItem tag={SubMenu} logo="comments" subMenuTitle="Direct messages">
                    <ListGroupItem tag={NavLink} to="/users/search" className="menu-item">
                        <i className="fas fa-plus-circle mr-2"></i>New direct message
                    </ListGroupItem>
                    { 
                        this.props.directMessages.map((user, index) => 
                            <ListGroupItem tag={NavLink} key={index} to={`/directMessages/${user.id}`} className="menu-item">{user.username}</ListGroupItem>
                        )
                    }
                </ListGroupItem>
            </ListGroup>
        );
    }
}

Menu.propTypes = {
    joinedChannels: PropTypes.array.isRequired,
    directMessages: PropTypes.array.isRequired,
    notifications: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    notifications: state.home.notifications
});

export default connect(mapStateToProps, null)(Menu);