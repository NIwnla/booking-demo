import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Popconfirm } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axiosInstance from "../../../service/axios";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import { AxiosConstants } from "../../../constaints/axiosContaint";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routeNames } from "../../../constaints/routeName";

const ApplicationManagementPageAdmin = () => {
    const { t } = useTranslation('global');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [sortByTime, setSortByTime] = useState("asc");
    const navigate = useNavigate();
    const { i18n } = useTranslation();

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
            console.error(t("career.management.messages.fetchError"), error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            // await axiosInstance.put(`${apiEndPoints.RECRUIT_INFORMATION.CONFIRM}/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error confirming application:', error);
        }
    };

    const handleDeny = async (id) => {
        try {
            // await axiosInstance.put(`${apiEndPoints.RECRUIT_INFORMATION.DENY}/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error denying application:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, search, sortByTime]);

    const columns = [
        {
            title: t("career.management.columns.firstName"),
            dataIndex: "firstName",
            key: "firstName",
            ellipsis: true,
            responsive: ['md'],
        },
        {
            title: t("career.management.columns.lastName"),
            dataIndex: "lastName",
            key: "lastName",
            ellipsis: true,
            responsive: ['xl'],
        },
        {
            title: t("career.management.columns.email"),
            dataIndex: "email",
            key: "email",
            ellipsis: true,
        },
        {
            title: t("career.management.columns.phoneNumber"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("career.management.columns.desiredJob"),
            responsive: ['lg'],
            key: "desiredJob",
            render: (text, record) => {
                return i18n.language === 'vi' ? record.desiredJobVN : record.desiredJobEN;
            },
            ellipsis: true,
        },
        {
            title: t("career.management.columns.actions"),
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`${routeNames.recruitInformation.detail}${record.id}`)}
                    />
                    <Popconfirm
                        title={t("career.management.messages.confirmApplication")}
                        description={t("career.management.messages.confirmApplicationDesc")}
                        onConfirm={() => handleConfirm(record.id)}
                        okText={t("career.management.messages.yes")}
                        cancelText={t("career.management.messages.no")}
                    >
                        <Button type="primary" icon={<CheckOutlined />} />
                    </Popconfirm>
                    <Popconfirm
                        title={t("career.management.messages.denyApplication")}
                        description={t("career.management.messages.denyApplicationDesc")}
                        onConfirm={() => handleDeny(record.id)}
                        okText={t("career.management.messages.yes")}
                        cancelText={t("career.management.messages.no")}
                    >
                        <Button danger icon={<CloseOutlined />} />
                    </Popconfirm>
                </Space>
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
        <div style={{padding:'5vh 10vw'}}>
            <h1>{t("career.management.titles.pageTitle")}</h1>
            <Input.Search
                placeholder={t("career.management.placeholders.search")}
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


    
