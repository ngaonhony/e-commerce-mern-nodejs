import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../features/cutomers/customerSlice";
import * as XLSX from "xlsx"; // Import thư viện xlsx
import { saveAs } from "file-saver"; // Import thư viện file-saver

const columns = [
  {
    title: "Số thứ tự",
    dataIndex: "key",
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "mobile",
  },
];

const Customers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const customerstate = useSelector((state) => state.customer.customers);

  const data1 = customerstate
    .filter((customer) => customer.role !== "admin")
    .map((customer, index) => ({
      key: index + 1,
      name: `${customer.firstname} ${customer.lastname}`,
      email: customer.email,
      mobile: customer.mobile,
    }));

  // Hàm xuất dữ liệu ra file Excel
  const exportToExcel = () => {
    // Tạo worksheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(data1);
    // Tạo workbook và thêm worksheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Xuất workbook ra buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Tạo Blob từ buffer
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    // Lưu file Excel
    saveAs(data, "danh_sach_khach_hang.xlsx");
  };

  return (
    <div>
      <h3 className="mb-4 title">Danh sách khách hàng</h3>
      <div style={{ marginBottom: 16 }}>
        <button type="primary" onClick={exportToExcel}>
          Xuất ra Excel
        </button>
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Customers;