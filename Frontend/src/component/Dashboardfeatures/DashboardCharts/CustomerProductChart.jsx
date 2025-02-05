import { useEffect, useState } from 'react';
import { Bar } from '@ant-design/plots';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCustomerProductData } from '../../../Store/Dashboards';

const CustomerProductChart = () => {
    const dispatch = useDispatch();
    const customerProductData = useSelector(state => state.Dashboards.customerProductData);

    useEffect(() => {
        dispatch(fetchCustomerProductData());
    }, [dispatch]);

    const config = {
        data: customerProductData,
        xField: 'type',
        yField: 'value',
        seriesField: 'type',
        legend: { position: 'top-left' },
        barWidthRatio: 0.4,
        minBarWidth: 10,
        maxBarWidth: 20,
        xAxis: { nice: true, label: { autoHide: true, autoRotate: false } },
        yAxis: { label: { style: { fontSize: 12 } } },
    };

    return (
        <div
          style={{
            width: "100%",
            height: "350px",
            margin: "0 auto",
          }}
        >
          <Bar {...config} />
        </div>
      );
};

export default CustomerProductChart;
