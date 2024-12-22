import React, { useEffect,useState } from "react";
import { Form, Input, Button, Modal, Row, Col, DatePicker,Select } from 'antd';
import axios from "axios";
import moment from 'moment';

// eslint-disable-next-line react/prop-types
const EditStatus = ({repId, handleeditstatusClose, iseditstatusModal, p_id}) => {


    const [showRemarks, setShowRemarks] = useState(false);
    const [defaultData, setDefaultData] = useState([]);
    const [form] = Form.useForm();
    
    const onValueChange = (changedvalue) => {   // to show date
        if (changedvalue.maintenanceStatus)
        {
            setShowRemarks(changedvalue.maintenanceStatus === "Completed");
        }
    };

    const onFinish = async(values) => {
        const payload = {
          REP_ID: repId,
          P_ID: p_id,
          P_STATUS: values.maintenanceStatus,
          REMARKS: values.remarks,
          REP_DATE: values.repairdate,
        };


        await axios.post("http://localhost:4000/api/updateRepair", payload)
          .then((response) => {
            handleeditstatusClose();
          })
          .catch((error) => console.error("Error:", error));
      };

      const fetchRepairDetails = async (rep_id) => {
        try {
          const response = await axios.get(`http://localhost:4000/api/getRepairProduct/${rep_id}`);
          const data = response.data;
          
          setDefaultData(data);

          form.setFieldsValue({
            maintenanceStatus: data.P_STATUS,
            remarks: data.REMARKS,
            repairdate: data.REP_DATE ? moment(data.REP_DATE) : null,
          });
        } catch (error) {
          console.error("Error fetching repair details:", error);
        }
      };

      const onCancel = () => {
          handleeditstatusClose();
          form.setFieldsValue(null);
      }

      useEffect(() => {
        if(iseditstatusModal) {fetchRepairDetails(repId);}
      },[iseditstatusModal]);

    return (
        <div>
           <Modal
            title="Edit Status And Remarks"
            centered
            open={iseditstatusModal}
            onCancel={onCancel}
            footer={[]}
            width={500}
        >
            <Form
            form={form}
            onFinish={(values) => {
                onFinish(values)}}
                layout="horizontal"
                onValuesChange={onValueChange}
            >
                <Row gutter={16}>
                    {/* Left Column */}
                    <Col span={50}>

                        <Form.Item
                            label="Status"
                            labelCol={{ span: 30 }}
                            
                            wrapperCol={{ span: 50 }}
                            name="maintenanceStatus"
                            rules={[{ required: true, message: 'Status is required!' }]}
                            >
                            <Select placeholder="Select a status" defaultValue={defaultData.p_status}>
                                <Select.Option value="Completed">Completed</Select.Option>
                                <Select.Option value="Repairing">Repairing</Select.Option>
                                <Select.Option value="Pending">Pending</Select.Option>
                            </Select>
                        </Form.Item>

                    {showRemarks && (
                        <>
                        <Form.Item 
                        name ="repairdate"
                        label="Repair Date" 
                        labelCol={{ span: 11 }} 
                        wrapperCol={{ span: 16 }}
                        rules={[{ required: true }]}
                        >
                        <DatePicker 
                        defaultValue={defaultData.rep_date ? moment(defaultData.REP_DATE) : null}
                        format="YYYY-MM-DD" 
                        />
                        </Form.Item>
                        </>
                    )}
                        <Form.Item
                            label="Remarks"
                            labelCol={{ span: 30 }}
                            wrapperCol={{ span: 50 }}
                            name="remarks"
                            //rules={[{ required: true, message: 'Remarks is required!' }]}
                            >
                            <Input.TextArea style={{width: "300px"}} defaultValue={defaultData.remarks}/>
                        </Form.Item>

                    </Col>

                </Row>

            <div style={{ display: "flex", justifyContent:"flex-end"}}>
                <Button key="close" onClick={handleeditstatusClose} style={{ marginRight: 10 }}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                    Edit
                </Button>
                </div>
            </Form>
        </Modal>
        </div>
    );
};

export default EditStatus;
