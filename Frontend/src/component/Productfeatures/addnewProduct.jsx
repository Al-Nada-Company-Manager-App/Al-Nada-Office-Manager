import React from "react";
import { Form, Input, Button, Modal, Row, Col, DatePicker, InputNumber, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// eslint-disable-next-line react/prop-types
const AddnewProduct = ({ handleFinish, handleUploadChange }) => {
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
                    Add Product
                </Button> 
           <Modal
            title="Add New Poduct"
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
                className="employee-form"
                onFinish={(values) => {
                    if(handleFinish(values)){
                        handlenewModalClose();
                    }
                  }}
            >
                <Row gutter={16}>
                    {/* Left Column */}
                    <Col span={12}>
                    <Form.Item label="Product Photo" labelCol={{ span: 11 }} wrapperCol={{ span: 16 }}>
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

                    <Form.Item
                        label="Product Name"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="productname"
                        rules={[{ required: true, message: 'Product name is required!' }]}
                        >
                        <Input />
                    </Form.Item>

                        <Form.Item
                        label="Category"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="category"
                        rules={[{ required: true, message: 'Category is required!' }]}
                        >
                        <Input />
                        </Form.Item>
                        <Form.Item
                        label="Opening Stock"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="quantity"
                        rules={[{ required: true, message: 'Quantity is required!' }]}
                        >
                        <InputNumber  style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Cost Price"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="costprice"
                        rules={[{ required: true, message: 'Price is required!' }]}
                        >
                        <InputNumber suffix="EGP" style={{ width: '100%' }} />
                    </Form.Item>

                        <Form.Item
                        label="Sell Price"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="sellprice"
                        rules={[{ required: true, message: 'Sell Price is required!' }]}
                        >
                        <InputNumber suffix="EGP" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item 
                        name ='expiredate'
                        label="Expire Date" 
                        labelCol={{ span: 11 }} 
                        wrapperCol={{ span: 16 }}
                        >
                        <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item
                            label="Model Code"
                            labelCol={{ span: 11 }}
                            wrapperCol={{ span: 16 }}
                            name="modelcode"
                            >
                            <Input />
                        </Form.Item>

                    </Col>

                    {/* Right Column */}

                    <Col span={12}>
                                <Form.Item
                                    label="Product Description"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 16 }}
                                    name="pdescription"
                                >
                                <Input.TextArea style={{width: "300px"}} />
                                </Form.Item>
                    </Col>
                </Row>

                {/* Submit Button */}
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" className="submit-button">
                            Add Product
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
        </div>
    );
};

export default AddnewProduct;
