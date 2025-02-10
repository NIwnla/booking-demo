import { Modal, Button, Checkbox, List, Spin, Pagination, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../../helpers/getLocalizedText';

const CategoryPickerModal = ({ isOpen, onClose, onSelect, selectedList }) => {
    const { t, i18n } = useTranslation('global');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState({}); // Use an object with id as the key
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchCategories(1, 10, '');
            setSelectedCategories(selectedList);
        }
    }, [isOpen, selectedList]);

    useEffect(() => {
        if (isOpen) {
            fetchCategories(pageIndex, pageSize, searchName);
        }
    }, [pageIndex, pageSize]);

    const fetchCategories = async (pageIndex, pageSize, searchName) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.CATEGORY.GET_ALL, {
                params: { pageIndex, pageSize, searchName },
            });
            const { items, totalCount } = response.data;
            setCategories(items);
            setTotalCount(totalCount);
        } catch (error) {
            console.error(t('category.categoryPickerModal.messages.fetchError'), error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategories((prev) => {
            const newSelectedCategories = { ...prev };
            if (newSelectedCategories[category.id]) {
                delete newSelectedCategories[category.id];
            } else {
                newSelectedCategories[category.id] = { nameVN: category.nameVN, nameEN: category.nameEN };
            }
            return newSelectedCategories;
        });
    };

    const handlePageChange = (page, pageSize) => {
        setPageIndex(page);
        setPageSize(pageSize);
    };

    const handleSearch = (value) => {
        setSearchName(value);
        setPageIndex(1); // Reset to the first page for new search results
        fetchCategories(1, pageSize, value); // Trigger API call immediately
    };

    const handleConfirm = () => {
        onSelect(selectedCategories); // Pass selected categories (id and name)
        onClose();
    };

    return (
        <Modal
            title={t('category.categoryPickerModal.titles.modalTitle')}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t('category.categoryPickerModal.buttons.cancel')}
                </Button>,
                <Button key="confirm" type="primary" onClick={handleConfirm}>
                    {t('category.categoryPickerModal.buttons.confirm')}
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Input.Search
                    placeholder={t('category.categoryPickerModal.placeholders.search')}
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onSearch={handleSearch}
                />
                <List
                    style={{ marginTop: 16 }}
                    dataSource={categories}
                    renderItem={(category) => (
                        <List.Item key={category.id}>
                            <Checkbox
                                checked={selectedCategories[category.id] !== undefined} // Check if category id exists in the selected object
                                onChange={() => handleCategorySelect(category)}
                            >
                                {getLocalizedText(category, 'name', i18n.language)}
                            </Checkbox>
                        </List.Item>
                    )}
                    pagination={{
                        current: pageIndex,
                        pageSize,
                        total: totalCount,
                        onChange: handlePageChange,
                        showSizeChanger: true, // Allows changing page size
                        pageSizeOptions: ['5', '10', '20', '50'], // Options for page size
                    }}
                />
            </Spin>
        </Modal>
    );
};

export default CategoryPickerModal;
