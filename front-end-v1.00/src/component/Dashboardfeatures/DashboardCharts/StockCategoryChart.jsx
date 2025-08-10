import { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';
import {useSelector, useDispatch} from 'react-redux';
import { fetchStockCategoryData } from '../../../Store/Dashboards';

const StockCategoryChart = () => {
    const dispatch = useDispatch();
    const stockCategoryData = useSelector(state => state.Dashboards.stockOverviewData);

    useEffect(() => {
        dispatch(fetchStockCategoryData());
    }, [dispatch]);

    const config = {
        data: stockCategoryData,
        angleField: 'value',
        colorField: 'type',
        legend: { position: 'right' },
        label: { type: 'outer' },
        title: { visible: true, text: 'Stock Category Distribution' },
    };

    return ( 
        <div
        style={{
          width: "50%",
          height: "350px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <Pie {...config} />
      </div>
      );
};

export default StockCategoryChart;