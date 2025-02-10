export const getLocalizedText = (item, key, language) => {
    return language === 'vi' ? item[`${key}VN`] || item[`${key}EN`] : item[`${key}EN`] || item[`${key}VN`];
};
