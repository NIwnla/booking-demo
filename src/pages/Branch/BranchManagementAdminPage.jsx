import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Image, Space, Spin, message, Tag, Typography } from 'antd';
import { AxiosConstants } from '../../constaints/axiosContaint';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import BranchCreationModal from '../../components/modals/branch/BranchCreationModal';
import BranchEditModal from '../../components/modals/branch/BranchEditModal';
import { Content } from 'antd/es/layout/layout';

const { Title } = Typography;

const BranchManagementAdminPage = () => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isCreationModalVisible, setIsCreationModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const fetchBranches = async () => {
        setIsFetching(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.BRANCH.GET_ALL(true));
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        } finally {
            setIsFetching(false);
        }
    };
    useEffect(() => {
        fetchBranches();
    }, []);

    const handleDetailClick = (branch) => {
        setSelectedBranch(branch);
        setIsDetailModalVisible(true);
    };

    const handleEditClick = (branch) => {
        setSelectedBranch(branch)
        setIsEditModalVisible(true);
    };

    const deleteBranch = async (id) => {
        setIsFetching(true);
        try {
            const response = await axiosInstance.delete(apiEndPoints.BRANCH.DELETE(id));
            message.success('Branch disabled/enabled successfully!');
            fetchBranches();
        } catch (error) {
            console.error('Error fetching branches:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleDeleteClick = (branchId) => {
        deleteBranch(branchId)
    };


    const handleDetailModalClose = () => {
        setIsDetailModalVisible(false);
        setSelectedBranch(null);
    };

    const handleCreateBranchClick = () => {
        setIsCreationModalVisible(true);
    };

    const handleCreationModalClose = () => {
        setIsCreationModalVisible(false);
    };

    const handleBranchCreated = (newBranch) => {
        fetchBranches();
    };

    const handleEditModalClose = () => {
        setIsEditModalVisible(false);
        setSelectedBranch(null);
    }

    const handleBranchEdited = (branch) => {
        fetchBranches();
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <span>
                    {text.length > 50 ? `${text.substring(0, 50)}...` : text}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (isDeleted) => (
                <Tag color={isDeleted ? 'red' : 'green'}>
                    {isDeleted ? 'Disabled' : 'Active'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, branch) => (
                <Space>
                    <Button onClick={() => handleDetailClick(branch)}>Detail</Button>
                    <Button onClick={() => handleEditClick(branch)}>Edit</Button>
                    <Button danger={!branch.isDeleted} onClick={() => handleDeleteClick(branch.id)}>
                        {branch.isDeleted ? 'Renable' : 'Disable'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={3}>Branch Management</Title>
                <Button
                    type="primary"
                    style={{ marginBottom: '16px' }}
                    onClick={handleCreateBranchClick}
                >
                    Create New Branch
                </Button>

                <Spin spinning={isFetching}>
                    <Table columns={columns} dataSource={branches} rowKey="id" pagination={false} />
                </Spin>

                <Modal
                    title="Branch Details"
                    open={isDetailModalVisible}
                    onCancel={handleDetailModalClose}
                    footer={null}
                >
                    {selectedBranch && (
                        <div>
                            <p><strong>Name:</strong> {selectedBranch.name}</p>
                            <p><strong>Description:</strong> {selectedBranch.description}</p>
                            <p><strong>Status:</strong> {selectedBranch.isDeleted ? 'Disabled' : 'Active'}</p>
                            <Image
                                src={`${AxiosConstants.AXIOS_BASEURL}/${selectedBranch.imagePath}`}
                                alt={selectedBranch.name}
                            />
                        </div>
                    )}
                </Modal>

                <BranchCreationModal
                    open={isCreationModalVisible}
                    onClose={handleCreationModalClose}
                    onBranchCreated={handleBranchCreated}
                />
                <BranchEditModal
                    open={isEditModalVisible}
                    onClose={handleEditModalClose}
                    branch={selectedBranch}
                    onBranchUpdated={handleBranchEdited} />
        </Content>
    );
};

export default BranchManagementAdminPage;
