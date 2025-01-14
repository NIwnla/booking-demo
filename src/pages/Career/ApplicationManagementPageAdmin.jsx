import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import axiosInstance from "../../service/axios";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { AxiosConstants } from "../../constaints/axiosContaint";

const ApplicationManagementPageAdmin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [sortByTime, setSortByTime] = useState("asc");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.RECRUIT_INFORMATION.GET_ALL, {
                params: {
                    pageIndex,
                    pageSize,
                    search,
                    sortByTime,
                },
            });
            const { items, totalCount } = response.data;
            setData(items);
            setTotal(totalCount);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, search, sortByTime]);

    const columns = [
        {
            title: "Họ",
            dataIndex: "firstName",
            key: "firstName",
            ellipsis: true,
            responsive: ['md'],
        },
        {
            title: "Tên",
            dataIndex: "lastName",
            key: "lastName",
            ellipsis: true,
            responsive: ['xl'],
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Căn cước công dân",
            dataIndex: "socialNumber",
            key: "socialNumber",
            render: (text) => text || "Chưa cung cấp",
        },
        {
            title: "Trường đang theo học",
            dataIndex: "currentEducation",
            key: "currentEducation",
            responsive: ['xl'], 
            render: (text) => text || "Chưa cung cấp",
        },
        {
            title: "Hồ sơ",
            dataIndex: "resumePath",
            key: "resumePath",
            render: (text) => (
                <a href={`${AxiosConstants.AXIOS_BASEURL}/${text}`} target = "_blank" rel = "noopener noreferrer" >
                    Xem hồ sơ
                </a >
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        if (sorter.order) {
            setSortByTime(sorter.order === "ascend" ? "asc" : "desc");
        }
    };

    return (
        <div>
            <h1>Danh sách ứng tuyển</h1>
            <Input.Search
                placeholder="Tìm kiếm đơn ứng tuyển"
                onSearch={(value) => setSearch(value)}
                style={{ marginBottom: 16, width: 300 }}
            />
            <Table
                // @ts-ignore
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{
                    current: pageIndex,
                    pageSize,
                    total,
                }}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default ApplicationManagementPageAdmin;
