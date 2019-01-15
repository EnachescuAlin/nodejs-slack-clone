import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import SubMenu from '../../common/components/SubMenu';

class Menu extends Component {
    render() {
        return (
            <ListGroup className="menu">
                <ListGroupItem tag={NavLink} to="/" className="menu-item">
                    <i className="fas fa-home mr-2"></i>Home
                </ListGroupItem>
                <ListGroupItem tag={SubMenu} logo="users" subMenuTitle="Channels">
                    <ListGroupItem tag={NavLink} to="/channels/create" className="menu-item">
                        <i className="fas fa-plus-circle mr-2"></i>Create new channel
                    </ListGroupItem>
                    <ListGroupItem tag={NavLink} to="/channels/search" className="menu-item">
                        <i className="fas fa-search mr-2"></i>Search channels
                    </ListGroupItem>
                    { 
                        this.props.joinedChannels.map((channel, index) => 
                            <ListGroupItem tag={NavLink} key={index} to={`/channels/${channel.id}`} className="menu-item">#{channel.name}</ListGroupItem>
                        )
                    }
                </ListGroupItem>
                <ListGroupItem tag={SubMenu} logo="users" subMenuTitle="Direct messages">
                    <ListGroupItem tag={NavLink} to="somethingLikeChannelsSearch" className="menu-item">
                        <i className="fas fa-plus-circle mr-2"></i>New direct message
                    </ListGroupItem>
                    { 
                        this.props.directMessages.map((user, index) => 
                            <ListGroupItem tag={NavLink} key={index} to={`nothingForMom`} className="menu-item">#{user.username}</ListGroupItem>
                        )
                    }
                </ListGroupItem>
            </ListGroup>
        );
    }
}

Menu.propTypes = {
    joinedChannels: PropTypes.array.isRequired,
    directMessages: PropTypes.array.isRequired
}

export default Menu;