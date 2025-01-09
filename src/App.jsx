import 'antd/dist/reset.css'; // Import Ant Design styles
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider, App as AntdApp } from 'antd';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'; 
import utc from 'dayjs/plugin/utc'; 

dayjs.extend(isoWeek);
dayjs.extend(utc);

const customTheme = {
  token: {
    colorPrimary: '#ff0000',     // Red as the primary color
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
      itemBg: '#ff00000',          // Red background for menu items
      itemColor: '#ffffff',       // White text for menu items
      itemHoverBg: '#cc0000',     // Slightly darker red on hover
      itemHoverColor: '#ffffff',  // White text on hover
      itemSelectedBg: '#ffffff',  // white for selected items
      itemSelectedColor: '#ffffff', // White text for selected items
      popupBg: '#ff0000',         // Red background for submenu popup
      horizontalItemSelectedBg: '0', // IDK why this work but this make the selected item background transparent
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
