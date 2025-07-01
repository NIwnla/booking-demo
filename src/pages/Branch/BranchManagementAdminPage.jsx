import { App, Button, Image, Modal, Space, Spin, Table, Tag, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import axiosInstance from '../../service/axios';
import { Helmet } from 'react-helmet-async';
import BranchCreationModal from './components/BranchCreationModal';
import BranchEditModal from './components/BranchEditModal';
import BranchLocationFilterBox from './components/BranchLocationFilterBox';

const { Title } = Typography;

const BranchManagementAdminPage = () => {
    const { t, i18n } = useTranslation('global');
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isCreationModalVisible, setIsCreationModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const { message } = App.useApp();

    const fetchBranches = async () => {
        setIsFetching(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.BRANCH.GET_ALL, {
                params: {
                    includeDeleted: true,
                    locationId: selectedLocation || null,
                }
            });
            setBranches(response.data);
        } catch (error) {
            message.error(t('branch.branchManagement.messages.fetchError'));
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, [selectedLocation]);

    const handleDetailClick = (branch) => {
        setSelectedBranch(branch);
        setIsDetailModalVisible(true);
    };

    const handleEditClick = (branch) => {
        setSelectedBranch(branch);
        setIsEditModalVisible(true);
    };

    const deleteBranch = async (id) => {
        setIsFetching(true);
        try {
            await axiosInstance.delete(apiEndPoints.BRANCH.DELETE(id));
            message.success(t('branch.branchManagement.messages.deleteSuccess'));
            fetchBranches();
        } catch (error) {
            message.error(t('branch.branchManagement.messages.fetchError'));
        } finally {
            setIsFetching(false);
        }
    };

    const handleDeleteClick = (branchId) => {
        deleteBranch(branchId);
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
    };

    const handleBranchEdited = (branch) => {
        fetchBranches();
    };

    const handleLocationChange = (value) => {
        setSelectedLocation(value);
    };

    const columns = [
        {
            title: t('branch.branchManagement.columns.name'),
            dataIndex: 'name',
            key: 'name',
            render: (_, branch) => getLocalizedText(branch, 'name', i18n.language),
        },
        {
            title: t('branch.branchManagement.columns.description'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            responsive: ['md'],
            render: (_, branch) => getLocalizedText(branch, 'description', i18n.language),
        },
        {
            title: t('branch.branchManagement.columns.location'),
            dataIndex: 'branchLocationName',
            key: 'location',
        },
        {
            title: t('branch.branchManagement.columns.reservationLimit'),
            dataIndex: 'reservationLimit',
            key: 'reservationLimit',
        },
        {
            title: t('branch.branchManagement.columns.status'),
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (isDeleted) => (
                <Tag color={isDeleted ? 'red' : 'green'}>
                    {isDeleted ? t('branch.branchManagement.tags.disabled') : t('branch.branchManagement.tags.active')}
                </Tag>
            ),
        },
        {
            title: t('branch.branchManagement.columns.action'),
            key: 'action',
            render: (_, branch) => (
                <Space wrap>
                    <Button onClick={() => handleDetailClick(branch)}>{t('branch.branchManagement.buttons.detail')}</Button>
                    <Button onClick={() => handleEditClick(branch)}>{t('branch.branchManagement.buttons.edit')}</Button>
                    <Button danger onClick={() => handleDeleteClick(branch.id)}>
                        {branch.isDeleted ? t('branch.branchManagement.buttons.reenable') : t('branch.branchManagement.buttons.disable')}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <title>Branch Management - Nollowa Chicken Admin</title>
                <meta name="description" content="Manage restaurant branches and locations" />
            </Helmet>

            <Content style={{ padding: '20px' }}>
                <Title level={3}>{t('branch.branchManagement.titles.pageTitle')}</Title>
                <Space style={{ marginBottom: '16px' }}>
                    <Button
                        type="primary"
                        onClick={handleCreateBranchClick}
                    >
                        {t('branch.branchManagement.titles.createButton')}
                    </Button>
                    <BranchLocationFilterBox
                        onLocationChange={handleLocationChange}
                        defaultValue={selectedLocation}
                    />
                </Space>

                <Spin spinning={isFetching} tip={t('branch.branchManagement.messages.loading')}>
                    <Table
                        // @ts-ignore
                        columns={columns} dataSource={branches} rowKey="id" pagination={false} />
                </Spin>

                <Modal
                    title={t('branch.branchManagement.titles.detailModalTitle')}
                    open={isDetailModalVisible}
                    onCancel={handleDetailModalClose}
                    footer={null}
                >
                    {selectedBranch && (
                        <div>
                            <p><strong>{t('branch.branchManagement.modals.detail.fields.name')}:</strong> {getLocalizedText(selectedBranch, 'name', i18n.language)}</p>
                            <p><strong>{t('branch.branchManagement.modals.detail.fields.description')}:</strong> {getLocalizedText(selectedBranch, 'description', i18n.language)}</p>
                            <p><strong>{t('branch.branchManagement.modals.detail.fields.location')}:</strong> {selectedBranch.branchLocationName}</p>
                            <p><strong>{t('branch.branchManagement.modals.detail.fields.status')}:</strong> {selectedBranch.isDeleted ? t('branch.branchManagement.tags.disabled') : t('branch.branchManagement.tags.active')}</p>
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
        </>
    );
};

export default BranchManagementAdminPage;
