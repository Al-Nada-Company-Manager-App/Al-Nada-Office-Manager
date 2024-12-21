import { useEffect, useState } from 'react';
import { Bar } from '@ant-design/plots';
import axios from 'axios';

const SupplierProductChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('http://localhost:4000/api/suppliersproducts');
            const formattedData = res.data.map(item => ({
                type: item.suppliername,
                value: item.productcount,
            }));
            setData(formattedData);
            console.log(formattedData);
        }
        fetchData();
    }, []);

    const config = {
        data,
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

export default SupplierProductChart;
