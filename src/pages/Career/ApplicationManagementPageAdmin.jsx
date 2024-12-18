import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { AxiosConstants } from "../../constaints/axiosContaint";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import axiosInstance from "../../service/axios";

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
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, search, sortByTime]);

    const columns = [
        {
            title: "First Name",
            dataIndex: "firstName",
            key: "firstName",
            ellipsis: true,
            responsive: ['md'],
        },
        {
            title: "Last Name",
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
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Resume",
            dataIndex: "resumePath",
            key: "resumePath",
            render: (text) => (
                <a href={`${AxiosConstants.AXIOS_BASEURL}/${text}`} target="_blank" rel="noopener noreferrer">
                    View Resume
                </a>
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
            <h1>Application List</h1>
            <Input.Search
                placeholder="Search applications"
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
