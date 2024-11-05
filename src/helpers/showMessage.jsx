import { message } from 'antd';

export const showMessage = (type, content) => {
    message[type](content);
};
