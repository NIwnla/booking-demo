import { App, Button, Card, Col, Image, Input, Row, Space, Spin, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateCategoryModal from './components/CreateCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import { Helmet } from 'react-helmet-async';

const { Title } = Typography;
const { Search } = Input;

const CategoryManagementAdminPage = () => {
    const { t, i18n } = useTranslation('global');
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
        <>
            <Helmet>
                <title>Category Management - Nollowa Chicken Admin</title>
                <meta name="description" content="Manage food categories for Nollowa Chicken menu" />
            </Helmet>
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
                    <Row gutter={[16, 16]}>
                        {categories.map((category) => (
                            <Col key={category.id} xs={24} sm={12} md={12} lg={6}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{ overflow: "hidden", height: "30vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Image
                                                alt={category.name}
                                                src={category.imagePath ? `${AxiosConstants.AXIOS_BASEURL}/${category.imagePath}` : 'placeholder-image-url'}
                                            />
                                        </div>
                                    }
                                >
                                    <Card.Meta
                                        title={getLocalizedText(category, 'name', i18n.language)}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                                        <Space wrap>
                                            <Button type="primary" style={{ maxWidth: "15vw" }} onClick={() => handleEditClick(category)}>
                                                {t('category.categoryManagement.buttons.edit')}
                                            </Button>
                                            <Button danger style={{ maxWidth: "15vw" }} onClick={() => handleDeleteClick(category.id)}>
                                                {t('category.categoryManagement.buttons.delete')}
                                            </Button>
                                        </Space>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Spin>
                <CreateCategoryModal
                    visible={isCreationModalVisible}
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
        </>
    );
};

export default CategoryManagementAdminPage;