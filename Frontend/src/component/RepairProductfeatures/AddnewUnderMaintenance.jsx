import React from "react";
import { Form, Input, Button, Modal, Row, Col, DatePicker, InputNumber, Upload,Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// eslint-disable-next-line react/prop-types
const AddnewUnderMaintenance = ({ handleFinish}) => {
    const [isnewModalVisible, setIsnewModalVisible] = React.useState(false);
    const handlenewModalClose = () => {
        setIsnewModalVisible(false);
    };
    const handlenewModalOpen = () => {
        setIsnewModalVisible(true);
    };
    return (
        <div>
             <Button 
                style={{ 
                    position: "absolute",
                    right: "40px",
                    top: "130px"
                }}
                type="primary"
                onClick={handlenewModalOpen}
                icon={<PlusOutlined />} iconPosition='start'>
                    Add New Device Under Maintenance
                </Button> 
           <Modal
            title="Add New Device Under Maintenance"
            centered
            open={isnewModalVisible}
            onCancel={handlenewModalClose}
            footer={[
                <Button key="close" onClick={handlenewModalClose}>
                    Close
                </Button>,
            ]}
            width={1000}
        >
            <Form
                layout="horizontal"
                //className="employee-form"
                onFinish={(values) => {
                    console.log(values);
                    if(handleFinish(values)){
                        handlenewModalClose();
                    }
                  }}
            >
                <Row gutter={16}>
                    {/* Left Column */}
                    <Col span={50}>


                    <Form.Item
                            label="Serial Number"
                            labelCol={{ span: 30 }}
                            wrapperCol={{ span: 50 }}
                            name="serialnumber"
                            rules={[{ required: true, message: 'Serial Number is required!' }]}
                            >
                            <Input style = {{width : '100%'}}/>
                        </Form.Item>

                    <Form.Item
                        label="Product Name"
                        labelCol={{ span: 30 }}
                        wrapperCol={{ span: 50 }}
                        name="productname"
                        rules={[{ required: true, message: 'Product name is required!' }]}
                        >
                        <Input />
                    </Form.Item>

                        <Form.Item
                        label="Category"
                        labelCol={{ span: 30 }}
                        wrapperCol={{ span: 50 }}
                        name="category"
                        >
                        <Input 
                        defaultValue={'Device Under Maintenance'}
                        readOnly/>
                        </Form.Item>
                        
                        <Form.Item
                            label="Status"
                            labelCol={{ span: 30 }}
                            wrapperCol={{ span: 50 }}
                            name="maintenanceStatus"
                            rules={[{ required: true, message: 'Status is required!' }]}
                            >
                            <Select placeholder="Select a status">
                                <Select.Option value="Completed">Completed</Select.Option>
                                <Select.Option value="Repairing">Repairing</Select.Option>
                            </Select>
                        </Form.Item>

                    </Col>

                </Row>

                {/* Submit Button */}
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" className="submit-button">
                            Add 
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
        </div>
    );
};

export default AddnewUnderMaintenance;
