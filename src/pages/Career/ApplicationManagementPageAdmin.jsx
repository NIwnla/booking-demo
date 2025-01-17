import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import axiosInstance from "../../service/axios";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { AxiosConstants } from "../../constaints/axiosContaint";
import { useTranslation } from "react-i18next";

const ApplicationManagementPageAdmin = () => {
    const { t } = useTranslation('global');
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
            console.error(t("career.management.messages.fetchError"), error);
        } finally {
            setLoading(false);
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
            title: t("career.management.columns.socialNumber"),
            dataIndex: "socialNumber",
            key: "socialNumber",
            render: (text) => text || t("career.management.messages.socialNumberMissing"),
        },
        {
            title: t("career.management.columns.currentEducation"),
            dataIndex: "currentEducation",
            key: "currentEducation",
            responsive: ['xl'],
            render: (text) => text || t("career.management.messages.currentEducationMissing"),
        },
        {
            title: t("career.management.columns.resume"),
            dataIndex: "resumePath",
            key: "resumePath",
            render: (text) => (
                <a href={`${AxiosConstants.AXIOS_BASEURL}/${text}`} target="_blank" rel="noopener noreferrer">
                    {t("career.management.messages.viewResume")}
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
