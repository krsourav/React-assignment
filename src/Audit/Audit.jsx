import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "../_actions";
import moment from "moment";
import { Navbar, Nav, Table } from "react-bootstrap";

class Auditpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      end: 5,
      searchKey: "",
      sortKey: "name",
      formatKey: "12",
    };
  }

  componentDidMount() {
    this.props.getUsers();
  }

  handleDeleteUser(id) {
    return (e) => this.props.deleteUser(id);
  }

  handleNext = () => {
    this.setState({
      start: this.state.start + 5,
      end: this.state.end + 5,
    });
  };

  handlePrev = () => {
    this.setState({
      start: this.state.start - 5,
      end: this.state.end - 5,
    });
  };

  handleSearch = (e) => {
    this.setState({
      searchKey: e.target.value,
      start: 0,
      end: 5,
    });
  };

  handleSort = (e) => {
      this.setState({
        sortKey: e.target.value,
      });
  };

  handleFormat = (e) => {
    this.setState({
      formatKey: e.target.value,
    });
  };

  render() {
    const { user, users } = this.props;
    const { start, end, searchKey, sortKey, formatKey } = this.state;
    let filteredUsers =
      searchKey && users.items
        ? users.items
            .filter((user) =>
              (user.firstName + user.lastName).toLowerCase().includes(searchKey)
            )
            .slice(start, end)
        : users.items
        ? users.items.slice(start, end)
        : null;
    if (sortKey && filteredUsers) {
      filteredUsers = filteredUsers.sort((user, user1) =>
        user[sortKey] < user1[sortKey]
          ? -1
          : user[sortKey] > user1[sortKey]
          ? 1
          : 0
      );
    }

    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand></Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link>
              <Link to="/">Home</Link>
            </Nav.Link>
            <Nav.Link href="#features">Auditor</Nav.Link>
            <Nav.Link>
              {" "}
              <Link to="/login">Logout</Link>
            </Nav.Link>
          </Nav>
        </Navbar>
        <div>
          <h1>Hi {user.firstName}!</h1>
          <p>You're logged in with React!!</p>
          <h3>All login audit :</h3>
          <input
            type="text"
            placeholder="search here..."
            onChange={this.handleSearch}
          />
          Time Format:
          <select
            name="timeFormat"
            onChange={this.handleFormat}
            value={this.formatKey}
            className="p-2"
          >
            <option value="12">12 hour format</option>
            <option value="24">24 hour format</option>
          </select>
          <div><strong>Please Note:</strong> Click on the heading to sort according to the field</div>
          {users.loading && (
            <div>
              <em>Loading users...</em>
            </div>
          )}
          {users.error && (
            <div className="text-danger">ERROR: {users.error}</div>
          )}
          {users.items && (
            <Table striped bordered hover style={{}}>
              <thead>
                <tr>
                  <th className="cursor-pointer">User Id</th>
                  <th onClick={() => this.setState({ sortKey: "role" })}>
                    Role
                  </th>
                  <th onClick={() => this.setState({ sortKey: "createdDate" })}>
                    Created Date
                  </th>
                  <th onClick={() => this.setState({ sortKey: "firstName" })}>
                    Username
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.role}</td>
                    <td>
                      {formatKey === "12"
                        ? moment(user.createdDate).format(
                            "DD/MM/yyy hh:mm:ss a"
                          )
                        : moment(user.createdDate).format("DD/MM/yyy HH:mm:ss")}
                    </td>
                    <td>{user.firstName + " " + user.lastName}</td>
                    {user.deleting ? (
                      <em> - Deleting...</em>
                    ) : user.deleteError ? (
                      <span className="text-danger">
                        {" "}
                        - ERROR: {user.deleteError}
                      </span>
                    ) : (
                      <span>
                        {" "}
                        - <a onClick={this.handleDeleteUser(user.id)}>Delete</a>
                      </span>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
        <div className="d-flex justify-content-end bg-white">
          <button
            onClick={this.handlePrev}
            // disabled={!filteredUsers || start === 0}
          >
            Prev{" "}
          </button>
          <button
            onClick={this.handleNext}
            // disabled={!filteredUsers || end + 5 >= filteredUsers.length}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getUsers: userActions.getAll,
  deleteUser: userActions.delete,
};

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };
