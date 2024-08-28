import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Pagination, Modal, Button, Typography } from 'antd';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const UserManagementAdminPage = () => {
    const [data, setData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [newRole, setNewRole] = useState(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, searchTerm, roleFilter]);

    const fetchRoles = async () => {
        try {
            const response = await axiosInstance.get(apiEndPoints.ROLES.GET_ALL);
            setRoles(response.data);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.USERS.GET_ALL, {
                params: {
                    pageIndex,
                    pageSize,
                    search: searchTerm,
                    roleFilter,
                },
            });

            setData(response.data.items);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPageIndex(1); // Reset to first page when searching
    };

    const handleRoleChange = (value) => {
        setRoleFilter(value);
        setPageIndex(1); // Reset to first page when filtering
    };

    const handleDetailClick = async (id) => {
        setDetailLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.USERS.GET_BY_ID(id));
            setSelectedUser(response.data);
            setIsDetailModalVisible(true);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }finally{
            setDetailLoading(false);
        }
    };

    const handleEditClick = (id) => {
        setSelectedUser(id);
        setIsEditModalVisible(true);
    };

    const handleRoleUpdate = async () => {
        try {
            await axiosInstance.put(apiEndPoints.USERS.EDIT_ROLE(selectedUser,newRole));
            fetchData(); // Refresh the data after updating
            setIsEditModalVisible(false);
        } catch (error) {
            console.error('Failed to update user role:', error);
        }
    };

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <Button onClick={() => handleDetailClick(record.id)}>Detail</Button>
                    <Button onClick={() => handleEditClick(record.id)}>Change Role</Button>
                </span>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={3}>User Management</Title>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Search
                    placeholder="Search by email"
                    onSearch={handleSearch}
                    style={{ width: '300px' }}
                />
                <Select
                    placeholder="Filter by Role"
                    style={{ width: '200px' }}
                    onChange={handleRoleChange}
                    allowClear
                >
                    {roles.map((role) => (
                        <Option key={role.name} value={role.name}>
                            {role.name}
                        </Option>
                    ))}
                </Select>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="email"
                pagination={false}
                loading={loading}
            />
            <Pagination
                current={pageIndex}
                pageSize={pageSize}
                total={totalCount}
                onChange={(page) => setPageIndex(page)}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />

            {/* Detail Modal */}
            <Modal
                title="User Details"
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
                loading={detailLoading}
            >
                {selectedUser && (
                    <div>
                        <p>Email: {selectedUser.email}</p>
                        <p>Role: {selectedUser.role}</p>
                        <p>Status:</p>
                        <ul>
                            <li>Cancelled: {selectedUser.status?.cancelled}</li>
                            <li>Booking: {selectedUser.status?.booking}</li>
                            <li>Confirmed: {selectedUser.status?.confirmed}</li>
                        </ul>
                    </div>
                )}
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Edit User Role"
                open={isEditModalVisible}
                onOk={handleRoleUpdate}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Select
                    value={newRole}
                    onChange={setNewRole}
                    style={{ width: '100%' }}
                >
                    {roles.map((role) => (
                        <Option key={role.name} value={role.name}>
                            {role.name}
                        </Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default UserManagementAdminPage;
