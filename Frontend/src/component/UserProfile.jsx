import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button, DatePicker, InputNumber } from "antd";
import moment from "moment";
import { updateUserProfile } from "../Store/UserProfile"; // Assuming you have an action to update the user profile

const UserProfile = () => {
  const SignedUser = useSelector((state) => state.auth.SignedUser);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    dispatch(updateUserProfile(values));
  };

  return (
    <div>
      <h1>User Profile</h1>
      <img src={SignedUser?.E_PHOTO} alt="User" />
      <Form
        form={form}
        initialValues={{
          F_NAME: SignedUser?.f_name,
          L_NAME: SignedUser?.l_name,
          Birth_Date: SignedUser?.birth_data ? moment(SignedUser.Birth_Date) : null,
          SALARY: SignedUser?.SALARY,
          E_PHOTO: SignedUser?.E_PHOTO,
          E_ADDRESS: SignedUser?.E_ADDRESS,
          E_EMAIL: SignedUser?.E_EMAIL,
          E_PHONE: SignedUser?.E_PHONE,
          E_CITY: SignedUser?.E_CITY,
          E_COUNTRY: SignedUser?.E_COUNTRY,
          E_ZIPCODE: SignedUser?.E_ZIPCODE,
          E_USERNAME: SignedUser?.E_USERNAME,
          E_PASSWORD: SignedUser?.E_PASSWORD,
        }}
        onFinish={handleFinish}
        layout="vertical"
      >
        <Form.Item label="First Name" name="F_NAME">
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="L_NAME">
          <Input />
        </Form.Item>
        <Form.Item label="Birth Date" name="Birth_Date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Salary" name="SALARY">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Photo URL" name="E_PHOTO">
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="E_ADDRESS">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="E_EMAIL">
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="E_PHONE">
          <Input />
        </Form.Item>
        <Form.Item label="City" name="E_CITY">
          <Input />
        </Form.Item>
        <Form.Item label="Country" name="E_COUNTRY">
          <Input />
        </Form.Item>
        <Form.Item label="Postal Code" name="E_ZIPCODE">
          <Input />
        </Form.Item>
        <Form.Item label="Username" name="E_USERNAME">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserProfile;