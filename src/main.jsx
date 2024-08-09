import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import React from 'react'
import { Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import Booking from './Booking.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={"/booking-demo"}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
