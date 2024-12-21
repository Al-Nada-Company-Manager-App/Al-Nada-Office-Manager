import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, InputNumber, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddRepairProcess = ({ handleFinish, devices, spareParts, fetchSpareParts, fetchDevices }) => {
  const [isnewModalVisible, setIsnewModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const [selectedSpareParts, setSelectedSpareParts] = useState([]);
  const [selectedDeviceStatus, setSelectedDeviceStatus] = useState(null);

  const handlenewModalOpen = () => {
    setIsnewModalVisible(true);
  };

  const onAddSparePart = () => {
    setSelectedSpareParts([...selectedSpareParts, { sp_id: null, sp_quantity: 0 }]);
  };

  const handleSpareChange = (index, field, value) => {
    const updatedSpareParts = [...selectedSpareParts];
    updatedSpareParts[index][field] = value;
    setSelectedSpareParts(updatedSpareParts);
  };

  const handleDeviceChange = (deviceId) => {
    const selectedDevice = devices.find((device) => device.p_id === deviceId);
    console.log("selected Device", selectedDevice);
    if (selectedDevice) {
      setSelectedDeviceStatus(selectedDevice.p_status);
    }
  };


  const onFinish = async (values) => {

    console.log("Form values before submission: ", values);


    console.log("Selected spare parts: ", selectedSpareParts);

    const payload = {
      ...values,
      rep_date: selectedDeviceStatus === "Completed" ? values.rep_date : null, 
      spare_parts: selectedSpareParts.filter((part) => part.sp_id || part.sp_quantity > 0),
    };


    console.log("Payload for submission: ", payload);

    const success = await handleFinish(payload);
    if (success) {
      message.success("Repair process added successfully!");
      form.resetFields();
      setSelectedSpareParts([]);
      setSelectedDeviceStatus(null); 
    } else {
      message.error("Failed to add repair process!");
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchSpareParts();
  }, []);

  const onCancel = () => {
    form.resetFields();
    setIsnewModalVisible(false);
  };

  return (
    <>
      <Button
        style={{
          position: "absolute",
          right: "40px",
          top: "130px",
        }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={handlenewModalOpen}
      >
        Add New Repair Process
      </Button>

      <Modal
        title="Add Repair Process"
        open={isnewModalVisible}
        onCancel={onCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {/* Device Selection */}
          <Form.Item
            name="p_id"
            label="Device Under Maintenance"
            rules={[{ required: true, message: "Please select a device!" }]}
          >
            <Select placeholder="Select a device"onChange={(value) => {
              console.log(value);
              handleDeviceChange(value)}}>
              {devices.map((device) => (
                <Option key={device.p_id} value={device.p_id} >
                  {device.p_name} - {device.serial_number}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Remarks */}
          <Form.Item
            name="remarks"
            label="Repair Remarks"
          >
            <Input.TextArea placeholder="Enter remarks about the repair" />
          </Form.Item>

          {/* Conditionally render Repair Date based on p_status */}
          {selectedDeviceStatus === "Completed" && (
            <Form.Item
              name="rep_date"
              label="Repair Date"
              rules={[{ required: true, message: "Please select a repair date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          )}

          {/* Spare Parts */}
          <div>
            <h4>Spare Parts</h4>
            {selectedSpareParts.map((part, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                {/* Spare Part Selection */}
                <Select
                  placeholder="Select Spare Part"
                  style={{ flex: 2 }}
                  onChange={(value) => handleSpareChange(index, "sp_id", value)}
                >
                  {spareParts.map((sp) => (
                    <Option key={sp.p_id} value={sp.p_id}>
                      {sp.p_name} (Available: {sp.p_quantity})
                    </Option>
                  ))}
                </Select>

                {/* Quantity Input */}
                <InputNumber
                  min={1}
                  placeholder="Quantity"
                  style={{ flex: 1 }}
                  onChange={(value) => handleSpareChange(index, "sp_quantity", value)}
                />
              </div>
            ))}

            {/* Add Spare Part Button */}
            <Button type="dashed" onClick={onAddSparePart}>
              + Add Spare Part
            </Button>
          </div>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: "20px" }}>
              Submit Repair Process
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddRepairProcess;
