import React from "react";
import { Modal, Button, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {  fetchPriceQuotations,deletePriceQuotation,setpqDetailVisible, setSelectedPQ } from '../../Store/PriceQuotation';

const PriceQuotationDetails = () => {
    const dispatch = useDispatch();
    const { selectedPQ, pqDetailVisible } = useSelector((state) => state.PriceQuotations);
    const { userAccess } = useSelector((state) => state.auth);

    const handleModalClose = () => {
        dispatch(setpqDetailVisible(false));
        dispatch(setSelectedPQ(null));
    };

    const handleDeletePQ = (id) => async () => {
         await dispatch(deletePriceQuotation(id));
         dispatch(setpqDetailVisible(false));
         dispatch(setSelectedPQ(null));
         dispatch(fetchPriceQuotations());
    };

    const handleSetStatus = (id) => {
        // Placeholder for setting the status of a Price Quotation
        console.log(`Set status for Price Quotation ID: ${id}`);
    };

    return (
        <Modal
            title="Price Quotation Details"
            centered
            open={pqDetailVisible}
            onCancel={handleModalClose}
            footer={[
                <Button key="close" onClick={handleModalClose}>
                    Close
                </Button>,
                selectedPQ ? (
                    userAccess.price_delete && (
                    <Button key="delete" onClick={handleDeletePQ(selectedPQ.pq_id)} type="primary" danger>
                        Delete Price Quotation
                    </Button>
                    )
                ) : null,
                // <Button key="set status" onClick={() => handleSetStatus(selectedPQ.pq_id)} type="primary">
                //     Set Status
                // </Button>,
            ]}
            width={800}
        >
            {selectedPQ && (
                <div>
                    <Row gutter={16}>
                        
                        <Col span={16}>
                            <div>
                                <p><strong>Price Quotation ID:</strong> {selectedPQ.pq_id}</p>
                                <p><strong>Discount:</strong> {selectedPQ.pq_discount}</p>
                                <p><strong>Currency:</strong> {selectedPQ.pq_currency}</p>
                                <p><strong>Duration:</strong> {selectedPQ.pq_duration}</p>
                                <p><strong>Total:</strong> {selectedPQ.pq_total}</p>
                                {/* Add any additional PQ-specific fields if required */}
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
};

export default PriceQuotationDetails;
