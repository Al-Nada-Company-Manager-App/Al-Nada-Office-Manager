import { Modal, Row, Col, Button, Table, Form } from "antd";
import { useState, useEffect } from "react";
import EditStatus from "./EditStatus";
import SparepartDetails from "./SparepartDetails";
import AddSparepart from "./AddSparepart";
import axios from "axios";
import moment from "moment";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line react/prop-types, no-unused-vars
const RepairDetails = ({
  selectedRepair,
  setSelectedRepair,
  detailRepairModalVisible,
  handleModalClose,
  fetchAllDUM,
  onDelete,
  fetchSpareParts,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [form] = Form.useForm();
  const [selectedPart, setSelectedPart] = useState(null);
  const [isSpareDetails, setisSpareDetails] = useState(false);
  const [iseditstatusModal, setiseditstatusModal] = useState(false);
  const { userAccess } = useSelector((state) => state.auth);

  const fetchUpdatedStatus = async (p_id) => {
    try {
      console.log("ma7bosa fe fetch updated status");
      const response = await axios.get(
        `http://localhost:4000/api/getProductStatus/${p_id}`
      );
      setSelectedRepair((prev) => ({
        ...prev,
        p_status: response.data.p_status, // Update the status field
      }));
      console.log("fe al fetch al data ba2et", selectedRepair);
    } catch (error) {
      console.error("Error fetching updated status:", error);
    }
  };

  useEffect(() => {
    if (selectedRepair && selectedRepair.spare_parts) {
      setSpareParts(selectedRepair.spare_parts);
    }
  }, [selectedRepair]);

  const handleisSpareDetailsClose = () => {
    setisSpareDetails(false);
  };

  const handleRowClick = (record) => {
    setSelectedPart(record);
    setisSpareDetails(true);
    console.log(selectedPart);
  };

  const handleeditstatusOpen = () => {
    setiseditstatusModal(true);
  };
  const handleeditstatusClose = () => {
    fetchUpdatedStatus(selectedRepair.p_id);
    fetchAllDUM();
    setiseditstatusModal(false);
  };

  const handleDeleteRepairProcess = (repId) => {
    onDelete(repId);
    handleModalClose(false);
  };

  const columns = [
    {
      title: "Spare Part Name",
      dataIndex: "sp_name",
      key: "sp_name",
    },
    {
      title: "Category",
      dataIndex: "sp_category",
      key: "sp_category",
    },
    {
      title: "Quantity Used",
      dataIndex: "sp_quantity",
      key: "sp_quantity",
      sorter: {
        compare: (a, b) => a.sp_quantity - b.sp_quantity,
        multiple: 1,
      },
    },
    {
      title: "Model Code",
      dataIndex: "sp_model_code",
      key: "sp_model_code",
    },
  ];

  useEffect(() => {
    fetchAllDUM();
  }, []);

  return (
    <>
      {selectedRepair && (
        <Modal
          title="Repair Process Details"
          centered
          open={detailRepairModalVisible}
          onCancel={() => {
            handleModalClose(false);
          }}
          footer={[
            <>
              {userAccess.repaire_delete && (
                <Button
                  key="Delete"
                  onClick={() => {
                    handleDeleteRepairProcess(selectedRepair.rep_id);
                  }}
                  danger
                >
                  Delete
                </Button>
              )}
              <Button
                key="close"
                onClick={() => {
                  handleModalClose(false);
                }}
              >
                Close
              </Button>
              ,
            </>,
          ]}
          width={800}
        >
          {selectedRepair && (
            <div>
              <Row gutter={16}>
                <Col span={8}></Col>

                <Col span={12}>
                  <div className="product-details">
                    <p>
                      <strong>Product Name:</strong> {selectedRepair.p_name}
                    </p>
                    <p>
                      <strong>Product Category:</strong>{" "}
                      {selectedRepair.p_category}
                    </p>
                    <p>
                      <strong>Serial Number:</strong>{" "}
                      {selectedRepair.serial_number}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedRepair.p_status}
                    </p>
                  </div>
                </Col>
              </Row>

              <div
                className="style-button"
                style={{
                  display: "flex",
                  position: "absolute",
                  right: "40px",
                  flexDirection: "column",
                  width: "25%",
                  gap: "10px",
                  padding: "10px 0",
                }}
              >
                {userAccess.repaire_edit && (
                  <Button
                    style={{
                      flex: 1,
                      height: "50px",
                      zIndex: 10,
                    }}
                    key="editstatus"
                    color="primary"
                    variant="outlined"
                    icon={<EditOutlined />}
                    onClick={handleeditstatusOpen}
                  >
                    Edit Remarks & Status
                  </Button>
                )}
                {userAccess.repaire_edit && (
                  <Button
                    style={{
                      flex: 1,
                      height: "50px",
                      zIndex: 10,
                    }}
                    color="primary"
                    variant="outlined"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Spare Part
                  </Button>
                )}
              </div>
              <Row gutter={16} style={{ marginTop: "50px" }}>
                <Col span={24}>
                  <h3>Used Spare Parts</h3>
                  <AddSparepart
                    visible={showAddModal}
                    rep_id={selectedRepair.rep_id}
                    onClose={() => setShowAddModal(false)}
                    fetchAllDUM={fetchAllDUM}
                    fetchSpareParts={fetchSpareParts}
                    tablespareParts={spareParts}
                    setUpdatedSpareParts={setSpareParts}
                  />
                  <EditStatus
                    repId={selectedRepair.rep_id}
                    handleeditstatusClose={handleeditstatusClose}
                    iseditstatusModal={iseditstatusModal}
                    p_id={selectedRepair.p_id}
                  />
                  <Table
                    columns={columns}
                    dataSource={spareParts}
                    rowKey="SP_ID"
                    onRow={(record) => ({
                      onClick: () => handleRowClick(record),
                    })}
                  />
                  {userAccess.repaire_edit && (
                    <SparepartDetails
                      repId={selectedRepair.rep_id}
                      selectedSparePart={selectedPart}
                      handleisSpareDetailsClose={handleisSpareDetailsClose}
                      isSpareDetails={isSpareDetails}
                      fetchAllDUM={fetchAllDUM}
                      setSpareParts={setSpareParts}
                      fetchSpareParts={fetchSpareParts}
                      tablespareParts={spareParts}
                      setUpdatedSpareParts={setSpareParts}
                    />
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
export default RepairDetails;
