import { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';
import axios from 'axios';

const StockCategoryChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('http://localhost:4000/api/stocks/summary');
            const formattedData = res.data.map(item => ({
                type: item.p_category,
                value: item.total_quantity,
            }));
            setData(formattedData);
        }
        fetchData();
    }, []);

    const config = {
        data,
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