import 'antd/dist/reset.css'; // Import Ant Design styles
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider, App as AntdApp } from 'antd';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'; // No need for a separate package

dayjs.extend(isoWeek);

const customTheme = {
  token: {
    colorPrimary: '#ff0000',     // Red as the primary color
    colorError: '#000000',       // Black as the danger color
    colorBgLayout: '#ffffff',    // White background
    colorBgContainer: '#ffffff', // White component background
    colorTableHeader: '#ff0000', // Custom color for table header
  },
  components: {
    Table: {
      headerBg: '#ff0000',       // Set table header background color to red
      headerColor: '#ffffff',    // Set table header text color to white
    },
    Menu: {
      itemBg: '#ff0000',    // Default background color for menu items
      colorText: '#ffffff',
      itemSelectedColor: '#ff0000',
      itemSelectedBg: '#ffffff',
      horizontalItemSelectedBg: '#ffffff',
      horizontalItemHoverBg: '#ffffff',
      itemHoverBg: '#ffffff',
      itemHoverColor: '#ff0000',
    }
  }
};


const App = () => {
  return (
    <ConfigProvider theme={customTheme}>
      <AntdApp>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  )
};

export default App;
