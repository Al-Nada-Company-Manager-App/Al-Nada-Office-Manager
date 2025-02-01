import React from "react";
import { Modal, Button, Row, Col, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  activateUser,
  deactivateUser,
  setSelectedUser,
  setUserModalVisible,
  getAccessRules,
} from "../../Store/Users";
import { convertTimestampToDate } from "../../utils/ConvertDate";
import AccessRulesModal from "./EditPermissions";
import {seteditaccessModalVisible} from "../../Store/Users";
const UserDetails = () => {
  const dispatch = useDispatch();
  const { userAccess } = useSelector((state) => state.auth);
  const { selectedUser, userModalVisible } = useSelector(
    (state) => state.Users
  );
  const handleModalClose = () => {
    dispatch(setUserModalVisible(false));
    dispatch(setSelectedUser(null));
  };

  const handleDeleteUser = (id) => async () => {
    const res =await dispatch(deleteUser(id));
    if(res.payload.success)
      message.success(res.payload.message);
    else
      message.error("Failed to delete user");
    dispatch(fetchUsers());
    handleModalClose();
  };

  const handleactivateUser = (id) => async () => {
    const res =await dispatch(activateUser(id));
    if(res.payload.success)
      message.success(res.payload.message);
    else
      message.error("Failed to activate user");
    dispatch(fetchUsers());
    handleModalClose();
  };
  const handledeactivateUser = (id) => async () => {
    const res =await dispatch(deactivateUser(id));
    if(res.payload.success)
      message.success(res.payload.message);
    else
      message.error("Failed to deactivate user");
    dispatch(fetchUsers());
    handleModalClose();
  };
  const handleedit = (id) => async () => {
    await dispatch(getAccessRules(id));
    dispatch(seteditaccessModalVisible(true));
  };
  return (
    <>
      {" "}
      {selectedUser && (
        <Modal
          title="Employee Details"
          centered
          open={userModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
            userAccess.users_edit && (
              <Button
                className="user-actions-btn"
                key="editPermisions"
                onClick={handleedit(selectedUser.e_id)}
                type="primary"
              >
                Edit Permissions
              </Button>
            ),
            userAccess.users_edit &&
              (
              selectedUser.e_active === true ? (
                <Button
                  className="user-actions-btn"
                  key="deactivateUser"
                  onClick={handledeactivateUser(selectedUser.e_id)}
                  danger
                >
                  Deactivate User
                </Button>
              ) : (
                <Button
                  className="user-actions-btn"
                  key="activateUser"
                  onClick={handleactivateUser(selectedUser.e_id)}
                  type="primary"
                >
                  Activate User
                </Button>
              )),
              userAccess.users_delete && (
                <Button
                  className="user-actions-btn"
                  key="deleteUser"
                  onClick={handleDeleteUser(selectedUser.e_id)}
                  type="primary"
                  danger
                >
                  Delete User
                </Button>
              ),
          ]}
          width={800} // Increased modal width
        >
          {selectedUser && (
            <div>
              <Row gutter={16}>
                {/* Employee Image on the left */}
                <Col span={8}>
                  <img
                    src={
                      selectedUser.e_photo
                        ? "./Users/" + selectedUser.e_photo
                        : "https://via.placeholder.com/150"
                    }
                    alt={`${selectedUser.f_name} ${selectedUser.l_name}`}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      objectFit: "cover",
                      maxHeight: "300px",
                      marginTop: "16px",
                      marginBottom: "16px",
                    }}
                  />
                </Col>

                {/* Employee Details on the right */}
                <Col span={16}>
                  <div className="user-details">
                    <p>
                      <strong>First Name:</strong> {selectedUser.f_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {selectedUser.l_name}
                    </p>
                    <p>
                      <strong>Birth Date:</strong>{" "}
                      {convertTimestampToDate(selectedUser.birth_date)}
                    </p>
                    <p>
                      <strong>Salary:</strong> ${selectedUser.salary}
                    </p>
                    <p>
                      <strong>Role:</strong> {selectedUser.e_role}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedUser.e_gender}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedUser.e_address}
                    </p>
                    <p>
                      <strong>City:</strong> {selectedUser.e_city}
                    </p>
                    <p>
                      <strong>Country:</strong> {selectedUser.e_country}
                    </p>
                    <p>
                      <strong>Zip Code:</strong> {selectedUser.e_zipcode}
                    </p>
                    <p>
                      <strong>Username:</strong> {selectedUser.e_username}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser.e_email}
                    </p>
                  </div>
                </Col>
              </Row>

              {/* Additional Information */}
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col span={24}></Col>
              </Row>
            </div>
          )}
        </Modal>
      )}
      <AccessRulesModal />


    </>
  );
};
export default UserDetails;


