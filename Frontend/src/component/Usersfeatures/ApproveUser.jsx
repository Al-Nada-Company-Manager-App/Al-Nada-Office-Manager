import React from 'react';
import { Table, Button } from 'antd';
import '../../Styles/Users.css';
import axios from 'axios';
import UserDetails from './UserDetails';

const columns = [
  {
    title: 'fName',
    dataIndex: 'f_name',
    showSorterTooltip: {
      target: 'full-header',
    },
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'lName',
    dataIndex: 'l_name',
    showSorterTooltip: false,
  },
  {
    title: 'Username',
    dataIndex: 'e_username',
    showSorterTooltip: false,
  },
  {
    title: 'Role',
    dataIndex: 'e_role',
  },
  {
    title: 'Email',
    dataIndex: 'e_email',
  },
];


const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:4000/allUsers');
    const pendingUsers = response.data.filter((user) => user.e_active === false);
    return pendingUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};


const ApproveUser = () => {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [usersData, setUsersData] = React.useState([]);
    React.useEffect(() => {
    fetchUsers().then((data) => {
      setUsersData(data);
    } );
    }, []);

  const handleRowClick = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };
   
  const handleDeleteUser = (id) => async () => {
    try {
        const response = await axios.post('http://localhost:4000/deleteUser', { id }, { withCredentials: true });
        fetchUsers().then((data) => {
            setUsersData(data);
        });
      handleModalClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  const handleactivateUser = (id) => async () => {
    try {
    const response = await axios.post('http://localhost:4000/activateUser', { id }, { withCredentials: true });
        fetchUsers().then((data) => {
            setUsersData(data);
        });
        handleModalClose();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }
  const handledeactivateUser = (id) => async () => {
        try {
        const response = await axios.post('http://localhost:4000/deactivateUser', { id }, { withCredentials: true });
        fetchUsers().then((data) => {
            setUsersData(data);
        });
        handleModalClose();
        } catch (error) {
        console.error('Error deactivating user:', error);
        }
  }
  



  return (
    <>
        <div style = {{
                margin: 5,
            }}>
            <h1>Users need to be Approved</h1>
        </div>
     
      <Table
        columns={columns}
        dataSource={usersData}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.id} // Ensure rows have unique keys
      />
        <UserDetails
            selectedUser={selectedUser}
            isModalVisible={isModalVisible}
            handleModalClose={handleModalClose}
            handleDeleteUser={handleDeleteUser}
            handledeactivateUser={handledeactivateUser}
            handleactivateUser={handleactivateUser}
        />
      
    </>
  );
};

export default ApproveUser;
