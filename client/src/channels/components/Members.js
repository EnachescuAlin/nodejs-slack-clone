import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

class Members extends Component {
    handleClick = (user) => () => {
        this.props.onMemberRemove(user);
    }

    render() {
        return (
            <React.Fragment>
                <h4 className="my-4">Members</h4>
                { this.props.users.map((user, index) =>
                        <div className="p-3 m-3 shadow border" key={index}>
                            {user.username}
                            { user.id !== this.props.ownerId ? 
                                <Button onClick={this.handleClick(user)} outline color="danger" className="float-right" size="sm">Remove</Button> 
                                : null 
                            }
                        </div>
                )}
            </React.Fragment>
        );
    }
}

Members.propTypes = {
    users: PropTypes.array.isRequired,
    ownerId: PropTypes.string.isRequired,
    onMemberRemove: PropTypes.func.isRequired
};

export default Members;