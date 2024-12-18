
import { Form, Input, Button, Modal, Row, Col, DatePicker, InputNumber,Select} from 'antd';
import moment from 'moment';
import React from 'react';
// eslint-disable-next-line react/prop-types
const EditexitProduct = ({editedData, seteditedData, isEditProductOpen, closeEditProduct, handleSaveData, editingform}) => {
    
    console.log(editedData);

        const [selectedCategory, setSelectedCategory] = React.useState(""); 
        const [ischemical, setischemical] = React.useState(false);
    const handleCategoryChange = (value) => {
        setSelectedCategory(value); 
        setischemical(value === "Chemical");
      };

    return (
        <div>
           <Modal
            title="Edit an Existing Poduct"
            centered
            open={isEditProductOpen}
            onCancel={closeEditProduct}
            onOk={() => {handleSaveData(editedData)}}
            footer={[
                <Button key="close" onClick={closeEditProduct}>
                    Close
                </Button>,
                <Button key="save" onClick={() => {handleSaveData(editedData);
                    closeEditProduct();
                }}>
                Save
                </Button>,
            ]}
            width={1000}
            >
            <Form
                form={editingform}
                layout="horizontal"
                className="edit-product-form"
                >
                <Row gutter={16}>
                    {/* Left Column */}
                    <Col span={12}>
                    {/* <Form.Item label="Product Photo" labelCol={{ span: 11 }} wrapperCol={{ span: 16 }}>
                            <Upload
                                beforeUpload={() => false} 
                                //onChange={handleUploadChange}
                                listType="picture-card"
                                maxCount={1}
                            >
                                <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                    </Form.Item> */}

                    <Form.Item
                        label="Product Name"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="productname"
                        rules={[{ required: true, message: 'Product name is required!' }]}
                        >
                        <Input 
                            defaultValue={editedData.p_name}
                            onChange={(element) => {
                                seteditedData((prevData) => ({...prevData, p_name: element.target.value}))
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="category"
                        rules={[{ required: true, message: 'Category is required!' }]}
                        >
                        <Select placeholder="Select a category" onChange={handleCategoryChange}>
                                <Select.Option value="Spare Part">Spare Part</Select.Option>
                                <Select.Option value="Laboratory Equipment">Laboratory Equipment</Select.Option>
                                <Select.Option value="Chemical">Chemical</Select.Option>
                                <Select.Option value="Measuring & Controllers">Measuring & Controllers</Select.Option>
                                <Select.Option value="Other">Other</Select.Option>
                            </Select>
                        </Form.Item>
                        {selectedCategory === "Other" && (
                            <Form.Item
                              label="Specify Category"
                              labelCol={{ span: 11 }}
                              wrapperCol={{ span: 16 }}
                              name="customCategory"
                              rules={[{ required: true, message: "Please specify the category!" }]}
                            >
                              <Input/>
                            </Form.Item>
                            )}
                        <Form.Item
                        label="Quantity"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="quantity"
                        rules={[{ required: true, message: 'Quantity is required!' }]}
                        >
                        <InputNumber  
                        style={{ width: '100%' }} 
                        // eslint-disable-next-line react/prop-types
                        defaultValue={editedData.p_quantity}
                            onChange={(element) => {
                                seteditedData((prevData) => ({...prevData, p_quantity: element}))
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Cost Price"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="costprice"
                        rules={[{ required: true, message: 'Price is required!' }]}
                        >
                        <InputNumber 
                        suffix="EGP" 
                        style={{ width: '100%' }} 
                        // eslint-disable-next-line react/prop-types
                        defaultValue={editedData.p_costprice}
                            onChange={(element) => {
                                seteditedData((prevData) => ({...prevData, p_costprice: element}))
                            }}
                        />
                    </Form.Item>

                        <Form.Item
                        label="Sell Price"
                        labelCol={{ span: 11 }}
                        wrapperCol={{ span: 16 }}
                        name="sellprice"
                        rules={[{ required: true, message: 'Sell Price is required!' }]}
                        >
                        <InputNumber 
                        suffix="EGP" 
                        style={{ width: '100%' }} 
                        // eslint-disable-next-line react/prop-types
                        defaultValue={editedData.p_sellprice}
                            onChange={(element) => {
                                seteditedData((prevData) => ({...prevData, p_sellprice: element}))
                            }}
                        />
                        </Form.Item>
                        {ischemical && (<Form.Item 
                        name ='expiredate'
                        label="Expire Date" 
                        labelCol={{ span: 11 }} 
                        wrapperCol={{ span: 16 }}
                        >
                        <DatePicker format="YYYY-MM-DD" 
                        defaultValue={editedData.expire_date ? moment(editedData.expire_date) : null}
                        onChange={(data, datestring) => {
                            seteditedData((prevData) => ({...prevData, expire_data: datestring}))
                        }}/>
                        </Form.Item>)}
                        <Form.Item
                            label="Model Code"
                            labelCol={{ span: 11 }}
                            wrapperCol={{ span: 16 }}
                            name="modelcode"
                            >
                            <Input 
                            // eslint-disable-next-line react/prop-types
                            defaultValue={editedData.model_code}
                            onChange={(element) => {
                                seteditedData((prevData) => ({...prevData, model_code: element.target.value}))
                            }}
                            />
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
                                <Input.TextArea 
                                style={{width: "300px"}} 
                                // eslint-disable-next-line react/prop-types
                                defaultValue={editedData.p_description}
                                onChange={(element) => {
                                seteditedData((prevData) => ({...prevData, p_description: element.target.value}))
                                }}
                                />
                                </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Modal>
        </div>
    );
};

export default EditexitProduct;
