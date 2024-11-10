// frontend/src/components/PaymentResult.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentResult = () => {
    const location = useLocation();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const query = new URLSearchParams(location.search);
            const response = await axios.get(`http://localhost:5000/api/order/vnpay_return?${query.toString()}`);
            setResult(response.data);
        };
        fetchData();
    }, [location]);

    return (
        <div>
            {result ? (
                result.code === '00' ? (
                    <p>Thanh toán thành công! Chi tiết giao dịch: {JSON.stringify(result.transaction)}</p>
                ) : (
                    <p>Thanh toán thất bại: {result.message}</p>
                )
            ) : (
                <p>Đang xử lý...</p>
            )}
        </div>
    );
};

export default PaymentResult;
