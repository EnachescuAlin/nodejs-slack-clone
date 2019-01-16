import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { actions } from '..';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AutoComplete from '../../common/components/AutoComplete';
import UserSearchDetails from '../components/UserSearchDetails';
import Spinner from '../../common/components/Spinner';
import Members from '../components/Members';

class InviteParticipants extends Component {
    onAddMember = (newMember) => {
        this.props.actions.addParticipant(this.props.match.params.channelId, newMember);
    }

    onRemoveMember = (member) => {
        this.props.actions.removeParticipant(this.props.match.params.channelId, member);
    }

    render() {
        return (
            <React.Fragment>
            { this.props.members ? 
                <Container className="mt-5">
                    <Row>
                        <Col xs={{ size: 10, offset: 1 }}>
                            <AutoComplete 
                                searchResults={this.props.usersSearched} 
                                itemComponent={UserSearchDetails} 
                                onSearchChange={this.props.actions.searchUsersForInvite}
                                onClickElement={this.onAddMember} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ size: 10, offset: 1 }}>
                            <Members 
                                onMemberRemove={this.onRemoveMember} 
                                ownerId={this.props.channel.createdBy} 
                                users={this.props.members} />
                        </Col>
                    </Row>
                </Container>
                : 
                <Spinner/>
            }
            </React.Fragment>
        );
    }

    componentWillMount() {
        this.props.actions.getMembers(this.props.match.params.channelId);
    }
}

InviteParticipants.propTypes = {
    usersSearched: PropTypes.array,
    members: PropTypes.array,
    match: ReactRouterPropTypes.match.isRequired
}

const mapStateToProps = (state) => ({
    usersSearched: state.channels.usersSearched,
    members: state.channels.selected.participants,
    channel: state.channels.selected
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteParticipants);