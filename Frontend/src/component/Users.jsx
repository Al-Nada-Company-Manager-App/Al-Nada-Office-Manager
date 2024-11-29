import React from 'react';
import { Table, Button } from 'antd';
import './Users.css';
import axios from 'axios';
import UserDetails from './Usersfeatures/UserDetails';
import AddnewUser from './Usersfeatures/addnewUser';

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
     return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};


const Users = () => {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [usersData, setUsersData] = React.useState([]);
  const [file, setFile] = React.useState(null);

    const handleUploadChange = (info) => {
        console.log(info.fileList);
        if (info.fileList.length > 0) {
            const filee = info.fileList[0].originFileObj;
            setFile(filee);
        } else {
            setFile(null); 
        }
    };

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
    const handleFinish = async (values) => {
        const formData = new FormData();
        values.birth_date = values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null;
    
        Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
        }); 
        if (file) {
            formData.append('photo', file); 
        }
        try {
            await axios.post('http://localhost:4000/addUser', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            fetchUsers().then((data) => {
                setUsersData(data);
            });
            return true;
        } catch (error) {
            console.error('Error adding user:', error);
            return false;
        }
    };
  



  return (
    <>
       
        <AddnewUser
            handleFinish={handleFinish}
            handleUploadChange={handleUploadChange}
        />

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

export default Users;
