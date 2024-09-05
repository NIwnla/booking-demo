import 'antd/dist/reset.css'; // Import Ant Design styles
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from 'antd';

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
    }
  }
};


const App = () => {
  return (
    <ConfigProvider theme={customTheme}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  )
};

export default App;
