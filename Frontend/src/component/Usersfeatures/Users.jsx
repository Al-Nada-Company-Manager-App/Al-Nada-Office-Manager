import React from "react";
import { Table, Button } from "antd";
import "../../Styles/Users.css";
import axios from "axios";
import UserDetails from "./UserDetails";
import AddnewUser from "./addnewUser";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  setSelectedUser,
  setUserModalVisible,
  getAccessRules,
} from "../../Store/Users";

const columns = [
  {
    title: "E_ID",
    dataIndex: "e_id",
    width: 20,
  },
  {
    title: "Employe Photo",
    dataIndex: "e_photo",
    render: (text, record) => (
      <img
        src={
          record.e_photo
            ? "./Users/" + record.e_photo
            : "https://via.placeholder.com/150"
        }
        alt="Employee"
        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
      />
    ),
  },
  {
    title: "fName",
    dataIndex: "f_name",
    showSorterTooltip: {
      target: "full-header",
    },
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "lName",
    dataIndex: "l_name",
    showSorterTooltip: false,
  },
  {
    title: "Username",
    dataIndex: "e_username",
    showSorterTooltip: false,
  },
  {
    title: "Role",
    dataIndex: "e_role",
  },
  {
    title: "Email",
    dataIndex: "e_email",
  },
];

const Users = () => {
  const dispatch = useDispatch();
  const { usersData,userLoading } = useSelector((state) => state.Users);
  const {SignedUser} = useSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleRowClick = async(record) => {
    if (SignedUser.id === record.e_id) {
      return;
    }
    dispatch(setSelectedUser(record));
    await dispatch(getAccessRules(record.e_id));
    dispatch(setUserModalVisible(true));
  };

  return (
    <>
      <AddnewUser />
      <Table
        columns={columns}
        dataSource={usersData}
        loading={userLoading}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.id}
      />
      <UserDetails />
    </>
  );
};

export default Users;
