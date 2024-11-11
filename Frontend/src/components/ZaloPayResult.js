import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ZaloPayResult = () => {
    const location = useLocation();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const query = new URLSearchParams(location.search);
            const response = await axios.get(`http://localhost:5000/api/zaloPay/callback?${query.toString()}`); // Gọi đến API callback ZaloPay
            setResult(response.data);
        };
        fetchData();
    }, [location]);

    return (
        <div>
            {result ? (
                result.return_code === '1' ? (
                    <div>
                        <p>Thanh toán thành công!</p>
                        <p>Chi tiết giao dịch:</p>
                        <ul>
                            <li>Mã giao dịch: {result.transaction.app_trans_id}</li>
                            <li>Số tiền: {result.transaction.amount}</li>
                            <li>ID giao dịch: {result.transaction.transactionId}</li>
                            <li>Mã ngân hàng: {result.transaction.bankCode}</li>
                            <li>Trạng thái: {result.transaction.status}</li>
                        </ul>
                    </div>
                ) : (
                    <p>Thanh toán thất bại: {result.return_message}</p>
                )
            ) : (
                <p>Đang xử lý...</p>
            )}
        </div>
    );
};

export default ZaloPayResult;