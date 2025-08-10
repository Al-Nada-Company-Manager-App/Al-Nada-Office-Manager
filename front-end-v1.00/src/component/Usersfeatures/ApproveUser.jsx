import React from "react";
import { Table, Button } from "antd";
import "../../Styles/Users.css";
import axios from "axios";
import UserDetails from "./UserDetails";

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
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  setSelectedUser,
  setUserModalVisible,
} from "../../Store/Users";

const ApproveUser = () => {
  const dispatch = useDispatch();
  const { approvedUsers,userLoading } = useSelector((state) => state.Users);
  React.useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleRowClick = (record) => {
    dispatch(setSelectedUser(record));
    dispatch(setUserModalVisible(true));
  };

  return (
    <>
      <div
        style={{
          margin: 5,
        }}
      >
        <h1>Users need to be Approved</h1>
      </div>

      <Table
        columns={columns}
        dataSource={approvedUsers}
        loading={userLoading}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.id} // Ensure rows have unique keys
      />
      <UserDetails />
    </>
  );
};

export default ApproveUser;
