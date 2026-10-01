/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quote from './pages/Quote';
import Products from './pages/Products';
import Solutions from './pages/Solutions';
import Industries from './pages/Industries';
import Company from './pages/Company';
import AdminDashboard from './pages/Admin';
import Projects from './pages/Projects';
import Engineering from './pages/Engineering';
import Login from './pages/Login';
import AdminRoute from './components/AdminRoute';
import { AssetsProvider } from './lib/contexts/AssetsContext';

export default function App() {
  return (
    <AssetsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/engineering" element={<Engineering />} />
          <Route path="/company" element={<Company />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </Router>
    </AssetsProvider>
  );
}
