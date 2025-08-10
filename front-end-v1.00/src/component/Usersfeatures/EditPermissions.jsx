import React, { useState, useEffect } from "react";
import { Modal, Form, Switch, Button, Collapse, Row, Col, message } from "antd";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { seteditaccessModalVisible,updateAccessRules } from "../../Store/Users";
import {fetchSignedUser} from "../../Store/authSlice";
const { Panel } = Collapse;

const AccessRulesModal = () => {
    const dispatch = useDispatch();
    const { editaccessModalVisible, selectedUserAccess } = useSelector((state) => state.Users);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    const onClose = ()=>{
        dispatch(seteditaccessModalVisible(false));
    };
  useEffect(() => {
      form.setFieldsValue(selectedUserAccess);
  }, [selectedUserAccess, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      await dispatch(updateAccessRules({ id: selectedUserAccess.e_id, ...values }));
      message.success("Access rules updated successfully");
      await dispatch(fetchSignedUser());
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Failed to update access rules");
    } finally {
      setLoading(false);
    }
  };

  const renderPageGroup = (page, fields) => (
    <Panel header={`${page} Permissions`} key={page} className="custom-panel">
      <Row gutter={[20, 1]}>
        {fields.map((field) => (
          <Col key={field} span={8}>
            <Form.Item
              label={field.replace("_", " ")}
              name={`${page}_${field.toLowerCase()}`}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        ))}
      </Row>
    </Panel>
  );

  const pages = {
    users: ["page", "add", "edit", "delete", "view"],
    products: ["page", "add", "edit", "delete", "view"],
    repaire: ["page", "add", "edit", "delete", "view", "adddum"],
    sales: ["page", "add", "edit", "delete", "view"],
    price: ["page", "add", "edit", "delete", "view"],
    debts: ["page", "add", "edit", "delete", "view"],
    purchase: ["page", "add", "edit", "delete", "view"],
    customer: ["page", "add", "edit", "delete", "view"],
    supplier: ["page", "add", "edit", "delete", "view"],
  };

  const pagesArray = Object.entries(pages);
  const midIndex = Math.ceil(pagesArray.length / 2);
  const leftPages = pagesArray.slice(0, midIndex);
  const rightPages = pagesArray.slice(midIndex);

  return (
    <Modal
      title="Edit Access Rules"
      open={editaccessModalVisible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      className="access-modal"
      width={800}
    >
      <Form form={form} layout="vertical" initialValues={selectedUserAccess || {}}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Collapse>
              {leftPages.map(([page, fields]) => renderPageGroup(page, fields))}
            </Collapse>
          </Col>
          <Col span={12}>
            <Collapse>
              {rightPages.map(([page, fields]) => renderPageGroup(page, fields))}
            </Collapse>
          </Col>
        </Row>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            if (selectedUserAccess) {
              form.setFieldsValue(selectedUserAccess);
            }
          }}
          style={{ marginTop: "16px" }}
        >
          Reset All
        </Button>
      </Form>
    </Modal>
  );
};

export default AccessRulesModal;
