import React from "react";
import { Form, Input, Button, Modal, Row, Col, Radio, DatePicker, InputNumber, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UserAddOutlined } from '@ant-design/icons';

const AddnewCustomer = ({ handleFinish, handleUploadChange }) => {
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
                    marginBottom: '16px', 
                    backgroundColor: '#389e0d',
                    marginLeft: 'auto', 
                    display: 'flex',   
                    alignItems: 'center', 
                }}
                type="primary"
                onClick={handlenewModalOpen}
                icon={<UserAddOutlined />} iconPosition='start'>
                    Add User
                </Button> 
           <Modal
            title="Add New Customer"
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
                className="customer-form"
                onFinish={(values) => {
                    if(handleFinish(values)){
                        handlenewModalClose();
                    }
                  }}
            >
                <Row gutter={16}>
                    {/* Left Column */}
                    <Col span={12}>
                      <Form.Item
                        label="Name"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="cname"
                        rules={[{ required: true, message: 'Name is required!' }]}
                        >
                        <Input />
                        </Form.Item>
                      <Form.Item
                        label="fax"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        name="Fax"
                        rules={[{ required: true, message: 'Fax is required!' }]}
                        >
                        <Input />
                        </Form.Item>
                    </Col>
                    {/* Right Column */}
                    <Col span={12}>
                        <Form.Item 
                        name = "caddress"
                        label="Address" 
                        labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item 
                        name = "city"
                        label="City" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                        name="zipcode"
                         label="Zip Code" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Photo" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                    <Upload
                                        beforeUpload={() => false} 
                                        onChange={handleUploadChange}
                                        listType="picture-card"
                                        maxCount={1}
                                    >
                                        <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                    </Col>
                </Row>

                {/* Submit Button */}
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" className="submit-button">
                            Add Employee
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
        </div>
    );
};

export default AddnewUser;
