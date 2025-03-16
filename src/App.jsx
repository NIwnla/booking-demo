import 'antd/dist/reset.css'; // Import Ant Design styles
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider, App as AntdApp } from 'antd';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import { DeliveryContext, DeliveryProvider } from './context/DeliveryContext';

dayjs.extend(isoWeek);
dayjs.extend(utc);

const customTheme = {
  token: {
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
      colorPrimary: '#ffffff',
      itemBg: '#ff0000',          // Red background for menu items
      itemColor: '#ffffff',       // White text for menu items
      itemHoverBg: '#cc0000',     // Slightly darker red on hover
      itemHoverColor: '#ffffff',  // White text on hover
      itemSelectedBg: '#cc0000',  // white for selected items
      itemSelectedColor: '#ffffff', // White text for selected items
      popupBg: '#ff0000',         // Red background for submenu popup
      horizontalItemSelectedBg: '0', // IDK why this work but this make the selected item background transparent,
    }
  }
};


const App = () => {
  return (
    <ConfigProvider theme={customTheme}>
      <AntdApp>
        <AuthProvider>
          <DeliveryProvider>
            <BrowserRouter future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}>
              <AppRoutes />
            </BrowserRouter>
          </DeliveryProvider>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  )
};

export default App;
