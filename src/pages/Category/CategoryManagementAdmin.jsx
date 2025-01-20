import { App, Button, Modal, Space, Spin, Table, Typography, Input, Row, Col } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CategoryCreationModal from '../../components/modals/category/CreateCategoryModal';
import CategoryEditModal from '../../components/modals/category/EditCategoryModal';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import CreateCategoryModal from '../../components/modals/category/CreateCategoryModal';
import EditCategoryModal from '../../components/modals/category/EditCategoryModal';

const { Title } = Typography;
const { Search } = Input;

const CategoryManagementAdminPage = () => {
    const { t } = useTranslation('global');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCreationModalVisible, setIsCreationModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchName, setSearchName] = useState('');
    const { message } = App.useApp();

    const fetchCategories = async () => {
        setIsFetching(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.CATEGORY.GET_ALL, {
                params: { pageIndex, pageSize, searchName }
            });
            setCategories(response.data.items);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            message.error(t('category.categoryManagement.messages.fetchError'));
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [pageIndex, pageSize, searchName]);


    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setIsEditModalVisible(true);
    };

    const deleteCategory = async (id) => {
        setIsFetching(true);
        try {
            await axiosInstance.delete(apiEndPoints.CATEGORY.DELETE(id));
            message.success(t('category.categoryManagement.messages.deleteSuccess'));
            fetchCategories();
        } catch (error) {
            message.error(t('category.categoryManagement.messages.fetchError'));
        } finally {
            setIsFetching(false);
        }
    };

    const handleDeleteClick = (categoryId) => {
        deleteCategory(categoryId);
    };

    const handleCreateCategoryClick = () => {
        setIsCreationModalVisible(true);
    };

    const handleCreationModalClose = () => {
        setIsCreationModalVisible(false);
    };

    const handleCategoryCreated = () => {
        fetchCategories();
    };

    const handleEditModalClose = () => {
        setIsEditModalVisible(false);
        setSelectedCategory(null);
    };

    const handleCategoryEdited = () => {
        fetchCategories();
    };

    const columns = [
        {
            title: t('category.categoryManagement.columns.name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('category.categoryManagement.columns.action'),
            key: 'action',
            render: (_, category) => (
                <Space wrap>
                    <Button onClick={() => handleEditClick(category)}>{t('category.categoryManagement.buttons.edit')}</Button>
                    <Button danger onClick={() => handleDeleteClick(category.id)}>
                        {t('category.categoryManagement.buttons.delete')}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={3}>{t('category.categoryManagement.titles.pageTitle')}</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Button
                        type="primary"
                        onClick={handleCreateCategoryClick}
                        style={{ width: '100%' }}

                    >
                        {t('category.categoryManagement.titles.createButton')}
                    </Button>
                </Col>
                <Col xs={24} md={12}>
                    <Search
                        placeholder={t('category.categoryManagement.search.placeholder')}
                        onSearch={(value) => setSearchName(value)}
                        style={{ width: '100%' }}

                    />
                </Col>

            </Row>
            <Spin spinning={isFetching} tip={t('category.categoryManagement.messages.loading')}>
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id"
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        total: totalCount,
                        onChange: (page, pageSize) => {
                            setPageIndex(page);
                            setPageSize(pageSize);
                        },
                    }}
                />
            </Spin>

            <CreateCategoryModal
                open={isCreationModalVisible}
                onClose={handleCreationModalClose}
                onCategoryCreated={handleCategoryCreated}
            />
            <EditCategoryModal
                open={isEditModalVisible}
                onClose={handleEditModalClose}
                category={selectedCategory}
                onCategoryUpdated={handleCategoryEdited}
            />
        </Content>
    );
};

export default CategoryManagementAdminPage;