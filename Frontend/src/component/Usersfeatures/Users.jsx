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
} from "../../Store/Users";
const columns = [
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
  const { usersData } = useSelector((state) => state.Users);

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleRowClick = (record) => {
    dispatch(setSelectedUser(record));
    dispatch(setUserModalVisible(true));
  };

  return (
    <>
      <AddnewUser />
      <Table
        columns={columns}
        dataSource={usersData}
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
