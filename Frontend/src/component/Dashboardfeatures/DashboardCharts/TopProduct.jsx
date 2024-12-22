import { useEffect, useState } from 'react';
import { Bar } from '@ant-design/plots';
import axios from 'axios';

const TopProductChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {

        async function fetchData() {

            const res = await axios.get('http://localhost:4000/topproducts');
            console.log(res.data);

            const formattedData = res.data.data.map(item => ({
                type: item.p_name,
                value: item.total_sale,
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

export default TopProductChart;
