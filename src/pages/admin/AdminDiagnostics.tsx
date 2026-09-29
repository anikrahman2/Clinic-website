import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  Home,
  Building,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight,
  X,
  Phone,
  User,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { StatusBadge } from '../../components/admin/StatusBadge.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import type { DiagnosticTest, TestOrder } from '../../types/index.js';

export function AdminDiagnostics() {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');

  // Orders State
  const [orders, setOrders] = useState<TestOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderCollectionFilter, setOrderCollectionFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);

  // Status Edit Modal State
  const [statusModalOrder, setStatusModalOrder] = useState<TestOrder | null>(null);
  const [newStatus, setNewStatus] = useState<TestOrder['status']>('Pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<'Unpaid' | 'Paid'>('Unpaid');
  const [newReportNotes, setNewReportNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Catalog State
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [testSearch, setTestSearch] = useState('');
  const [testCategoryFilter, setTestCategoryFilter] = useState('All');

  // Test Create/Edit Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [testForm, setTestForm] = useState({
    name: '',
    code: '',
    slug: '',
    category: 'Pathology & Blood' as DiagnosticTest['category'],
    price: '',
    discountPrice: '',
    sampleType: 'Blood (Serum)',
    fastingRequired: false,
    fastingHours: '0',
    turnaroundTime: 'Same Day Report',
    parametersCount: '1',
    description: '',
    preparationNotes: '',
    isPopular: false,
    isPackage: false,
    packageTests: '',
    active: true,
  });
  const [savingTest, setSavingTest] = useState(false);

  const { showToast } = useToast();

  const categories = [
    'All',
    'Health Packages',
    'Pathology & Blood',
    'Diabetes & Hormone',
    'Cardiology & ECG',
    'Radiology & Imaging',
    'Pregnancy & Maternal',
  ];

  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.getTestOrders({
        search: orderSearch || undefined,
        status: orderStatusFilter !== 'All' ? orderStatusFilter : undefined,
        collectionType: orderCollectionFilter !== 'All' ? orderCollectionFilter : undefined,
      });
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch test orders', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Catalog Tests
  const fetchTests = async () => {
    setTestsLoading(true);
    try {
      const res = await api.getDiagnosticTests({
        search: testSearch || undefined,
        category: testCategoryFilter !== 'All' ? testCategoryFilter : undefined,
        activeOnly: false,
      });
      if (res.success && Array.isArray(res.data)) {
        setTests(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load test catalog', 'error');
    } finally {
      setTestsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchTests();
    }
  }, [activeTab, orderStatusFilter, orderCollectionFilter, testCategoryFilter]);

  const handleOpenStatusModal = (order: TestOrder) => {
    setStatusModalOrder(order);
    setNewStatus(order.status);
    setNewPaymentStatus(order.paymentStatus || 'Unpaid');
    setNewReportNotes(order.reportNotes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await api.updateTestOrderStatus(statusModalOrder._id, {
        status: newStatus,
        paymentStatus: newPaymentStatus,
        reportNotes: newReportNotes,
      });
      if (res.success) {
        showToast('Order status updated successfully', 'success');
        setStatusModalOrder(null);
        fetchOrders();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async (orderId: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      const res = await api.deleteTestOrder(id);
      if (res.success) {
        showToast(`Order ${orderId} deleted`, 'info');
        fetchOrders();
        if (selectedOrder?._id === id) setSelectedOrder(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete order', 'error');
    }
  };

  // Open Test Create / Edit Modal
  const handleOpenCreateTest = () => {
    setEditingTestId(null);
    setTestForm({
      name: '',
      code: `JCH-TEST-${Math.floor(10 + Math.random() * 90)}`,
      slug: '',
      category: 'Pathology & Blood',
      price: '500',
      discountPrice: '',
      sampleType: 'Blood (Serum)',
      fastingRequired: false,
      fastingHours: '0',
      turnaroundTime: 'Same Day Report',
      parametersCount: '1',
      description: '',
      preparationNotes: 'No special preparation needed.',
      isPopular: false,
      isPackage: false,
      packageTests: '',
      active: true,
    });
    setIsTestModalOpen(true);
  };

  const handleOpenEditTest = (test: DiagnosticTest) => {
    setEditingTestId(test._id);
    setTestForm({
      name: test.name,
      code: test.code,
      slug: test.slug,
      category: test.category,
      price: String(test.price),
      discountPrice: test.discountPrice ? String(test.discountPrice) : '',
      sampleType: test.sampleType,
      fastingRequired: test.fastingRequired,
      fastingHours: String(test.fastingHours || 0),
      turnaroundTime: test.turnaroundTime,
      parametersCount: String(test.parametersCount || 1),
      description: test.description,
      preparationNotes: test.preparationNotes,
      isPopular: !!test.isPopular,
      isPackage: !!test.isPackage,
      packageTests: (test.packageTests || []).join(', '),
      active: test.active,
    });
    setIsTestModalOpen(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.name || !testForm.price) {
      showToast('Name and price are required.', 'error');
      return;
    }

    setSavingTest(true);
    try {
      const payload: any = {
        name: testForm.name,
        code: testForm.code || `JCH-${Date.now().toString().slice(-4)}`,
        slug: testForm.slug || testForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: testForm.category,
        price: Number(testForm.price),
        discountPrice: testForm.discountPrice ? Number(testForm.discountPrice) : undefined,
        sampleType: testForm.sampleType,
        fastingRequired: testForm.fastingRequired,
        fastingHours: Number(testForm.fastingHours) || 0,
        turnaroundTime: testForm.turnaroundTime,
        parametersCount: Number(testForm.parametersCount) || 1,
        description: testForm.description,
        preparationNotes: testForm.preparationNotes,
        isPopular: testForm.isPopular,
        isPackage: testForm.isPackage,
        packageTests: testForm.packageTests
          ? testForm.packageTests.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        active: testForm.active,
      };

      if (editingTestId) {
        await api.updateDiagnosticTest(editingTestId, payload);
        showToast('Diagnostic test updated successfully', 'success');
      } else {
        await api.createDiagnosticTest(payload);
        showToast('New diagnostic test added to catalog', 'success');
      }
      setIsTestModalOpen(false);
      fetchTests();
    } catch (err: any) {
      showToast(err.message || 'Failed to save diagnostic test', 'error');
    } finally {
      setSavingTest(false);
    }
  };

  const handleDeleteTest = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) return;
    try {
      const res = await api.deleteDiagnosticTest(id);
      if (res.success) {
        showToast(`Removed "${name}" from catalog`, 'info');
        fetchTests();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete test', 'error');
    }
  };

  // Order summary metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const homeCollectionCount = orders.filter((o) => o.collectionType === 'Home Sample Collection').length;

  return (
    <AdminLayout title="Diagnostic Lab & Orders">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header and Tab switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-teal-400" />
              Diagnostic Lab & E-Commerce Orders
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Manage patient laboratory test orders, home sample collection requests, and test catalog.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Test Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Test Catalog ({tests.length})
            </button>
          </div>
        </div>

        {/* ================= TAB 1: TEST ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xs">
                <span className="text-xs text-slate-400 font-semibold block">Total Orders</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">
                  {orders.length}
                </span>
                <span className="text-[11px] text-teal-400">Online & Counter bookings</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xs">
                <span className="text-xs text-amber-400 font-semibold block">Pending Action</span>
                <span className="text-2xl font-extrabold text-amber-300 mt-1 block">
                  {pendingOrdersCount}
                </span>
                <span className="text-[11px] text-amber-400/80">Awaiting sample collection</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xs">
                <span className="text-xs text-indigo-400 font-semibold block">Home Collections</span>
                <span className="text-2xl font-extrabold text-indigo-300 mt-1 block">
                  {homeCollectionCount}
                </span>
                <span className="text-[11px] text-indigo-400/80">Jashore local doorstep</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xs">
                <span className="text-xs text-emerald-400 font-semibold block">Order Value (BDT)</span>
                <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">
                  ৳{totalRevenue.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-400/80">Total diagnostic volume</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchOrders();
                }}
                className="relative w-full md:w-80"
              >
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by patient name, phone, order ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </form>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  aria-label="Filter by order status"
                  className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Sample Collected">Sample Collected</option>
                  <option value="Processing in Lab">Processing in Lab</option>
                  <option value="Report Ready">Report Ready</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={orderCollectionFilter}
                  onChange={(e) => setOrderCollectionFilter(e.target.value)}
                  aria-label="Filter by collection type"
                  className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="All">All Collection Types</option>
                  <option value="Hospital Visit">Hospital Visit</option>
                  <option value="Home Sample Collection">Home Sample Collection</option>
                </select>

                <button
                  onClick={fetchOrders}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Orders Table */}
            {ordersLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Loading diagnostic orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-white font-bold text-sm">No diagnostic orders found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Patients booking diagnostic tests or health packages will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-bold">Order ID</th>
                        <th className="py-3 px-4 font-bold">Patient & Contact</th>
                        <th className="py-3 px-4 font-bold">Collection Mode</th>
                        <th className="py-3 px-4 font-bold">Tests Ordered</th>
                        <th className="py-3 px-4 font-bold">Total Amount</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-900/50 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-teal-400 block">
                              {order.orderId}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{order.patientName}</div>
                            <div className="text-[11px] text-slate-400">
                              {order.phone} • {order.age} yrs ({order.gender})
                            </div>
                            {order.address && (
                              <div className="text-[10px] text-teal-300/80 truncate max-w-xs mt-0.5">
                                {order.address}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.collectionType === 'Home Sample Collection'
                                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {order.collectionType === 'Home Sample Collection' ? (
                                <Home className="w-3 h-3 text-indigo-400" />
                              ) : (
                                <Building className="w-3 h-3 text-slate-400" />
                              )}
                              {order.collectionType}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {order.preferredDate} ({order.preferredTimeSlot.split(' ')[0]})
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-200">
                              {order.items?.length || 0} test(s)
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                              {order.items?.map((i) => i.name).join(', ')}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">৳{order.totalAmount}</div>
                            <span
                              className={`text-[10px] font-semibold ${
                                order.paymentStatus === 'Paid'
                                  ? 'text-emerald-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {order.paymentStatus || 'Unpaid'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                                title="View Order Details & Receipt"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenStatusModal(order)}
                                className="p-1.5 bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-700/50 rounded-lg transition"
                                title="Update Status / Notes"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.orderId, order._id)}
                                className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/40 rounded-lg transition"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: TEST CATALOG ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Catalog Controls */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchTests();
                }}
                className="relative w-full md:w-80"
              >
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search test name, code, category..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </form>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={testCategoryFilter}
                  onChange={(e) => setTestCategoryFilter(e.target.value)}
                  aria-label="Filter by category"
                  className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleOpenCreateTest}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add New Test
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            {testsLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Loading diagnostic tests...
              </div>
            ) : tests.length === 0 ? (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-12 text-center">
                <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-white font-bold text-sm">No tests found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Add a new diagnostic test or package to make it available for patient ordering.
                </p>
                <button
                  onClick={handleOpenCreateTest}
                  className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
                >
                  Add Test
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests.map((test) => (
                  <div
                    key={test._id}
                    className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-800/40">
                          {test.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {test.isPopular && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
                              Popular
                            </span>
                          )}
                          <span
                            className={`w-2 h-2 rounded-full ${
                              test.active ? 'bg-emerald-400' : 'bg-slate-600'
                            }`}
                            title={test.active ? 'Active' : 'Inactive'}
                          />
                        </div>
                      </div>

                      <h3 className="font-extrabold text-white text-base mt-2.5 leading-snug">
                        {test.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                        <span>Code: {test.code}</span>
                        <span>•</span>
                        <span>{test.turnaroundTime}</span>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {test.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                        <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                          Sample: {test.sampleType}
                        </span>
                        {test.fastingRequired ? (
                          <span className="bg-amber-950/50 text-amber-300 px-2 py-0.5 rounded-md border border-amber-800/40">
                            Fasting: {test.fastingHours}h
                          </span>
                        ) : (
                          <span className="bg-slate-900 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800">
                            No Fasting
                          </span>
                        )}
                        {test.isPackage && (
                          <span className="bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-800/40">
                            Package ({test.packageTests?.length || 0} tests)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        {test.discountPrice ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-extrabold text-white">
                              ৳{test.discountPrice}
                            </span>
                            <span className="text-xs text-slate-500 line-through">৳{test.price}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-extrabold text-white">৳{test.price}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditTest(test)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700/60 transition"
                          title="Edit Test Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test._id, test.name)}
                          className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800/40 transition"
                          title="Delete from Catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= MODAL: ORDER DETAILS & RECEIPT ================= */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="font-extrabold text-base text-white">Diagnostic Order Invoice</h3>
                  <span className="font-mono text-xs text-teal-400 font-bold">
                    {selectedOrder.orderId}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Patient Information */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Patient Name:</span>
                    <strong className="text-white">{selectedOrder.patientName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-teal-300 font-semibold">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Age & Gender:</span>
                    <span>
                      {selectedOrder.age} yrs • {selectedOrder.gender}
                    </span>
                  </div>
                  {selectedOrder.email && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span>{selectedOrder.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Collection Mode:</span>
                    <span className="font-bold text-amber-300">{selectedOrder.collectionType}</span>
                  </div>
                  {selectedOrder.address && (
                    <div className="pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400 block">Home Address:</span>
                      <span className="text-white">{selectedOrder.address}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Preferred Slot:</span>
                    <span className="text-slate-300">
                      {selectedOrder.preferredDate} ({selectedOrder.preferredTimeSlot})
                    </span>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-950 px-3 py-2 font-bold text-slate-300 border-b border-slate-800">
                    Test Items ({selectedOrder.items?.length || 0})
                  </div>
                  <div className="divide-y divide-slate-800">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <span className="text-[10px] font-mono text-slate-400">{item.code}</span>
                        </div>
                        <div className="font-bold text-teal-400">৳{item.price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-950/80 p-3 border-t border-slate-800 space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span>৳{selectedOrder.subtotal}</span>
                    </div>
                    {selectedOrder.collectionFee > 0 && (
                      <div className="flex justify-between text-slate-400">
                        <span>Home Sample Collection Fee:</span>
                        <span>৳{selectedOrder.collectionFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-extrabold text-white pt-1 border-t border-slate-800">
                      <span>Total Payable:</span>
                      <span className="text-emerald-400">৳{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Internal Notes */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Current Status:</span>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className="font-bold text-emerald-400">
                      {selectedOrder.paymentStatus || 'Unpaid'} ({selectedOrder.paymentMethod})
                    </span>
                  </div>
                  {selectedOrder.reportNotes && (
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-slate-400 block font-semibold">Laboratory Notes:</span>
                      <p className="text-slate-300 mt-0.5">{selectedOrder.reportNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleOpenStatusModal(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-center"
                  >
                    Update Status & Notes
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL: UPDATE STATUS ================= */}
        {statusModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-white">Update Diagnostic Order</h3>
                  <span className="font-mono text-xs text-teal-400 font-bold">
                    {statusModalOrder.orderId}
                  </span>
                </div>
                <button
                  onClick={() => setStatusModalOrder(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Pending">Pending (Awaiting Collection)</option>
                    <option value="Sample Collected">Sample Collected</option>
                    <option value="Processing in Lab">Processing in Lab</option>
                    <option value="Report Ready">Report Ready (Results Verified)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e: any) => setNewPaymentStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid / Cleared</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Laboratory Notes / Verification Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Blood sample drawn at 09:30 AM. Automated analyzer processing completed. Report ready for collection at counter."
                    value={newReportNotes}
                    onChange={(e) => setNewReportNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition"
                  >
                    {updatingStatus ? 'Updating...' : 'Save Order Status'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusModalOrder(null)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: CREATE / EDIT TEST CATALOG ================= */}
        {isTestModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="font-extrabold text-base text-white">
                  {editingTestId ? 'Edit Diagnostic Test' : 'Add Diagnostic Test to Catalog'}
                </h3>
                <button
                  onClick={() => setIsTestModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTest} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Test Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lipid Profile Comprehensive"
                      value={testForm.name}
                      onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Test Code</label>
                    <input
                      type="text"
                      placeholder="e.g. JCH-LIP-03"
                      value={testForm.code}
                      onChange={(e) => setTestForm({ ...testForm, code: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                    <select
                      value={testForm.category}
                      onChange={(e: any) => setTestForm({ ...testForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    >
                      <option value="Pathology & Blood">Pathology & Blood</option>
                      <option value="Diabetes & Hormone">Diabetes & Hormone</option>
                      <option value="Cardiology & ECG">Cardiology & ECG</option>
                      <option value="Radiology & Imaging">Radiology & Imaging</option>
                      <option value="Pregnancy & Maternal">Pregnancy & Maternal</option>
                      <option value="Health Packages">Health Packages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Price (BDT ৳) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1200"
                      value={testForm.price}
                      onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Discount Price (BDT ৳)
                    </label>
                    <input
                      type="number"
                      placeholder="Optional offer price"
                      value={testForm.discountPrice}
                      onChange={(e) => setTestForm({ ...testForm, discountPrice: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Sample Type</label>
                    <input
                      type="text"
                      placeholder="Blood (Serum), Urine, etc."
                      value={testForm.sampleType}
                      onChange={(e) => setTestForm({ ...testForm, sampleType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Turnaround Time
                    </label>
                    <input
                      type="text"
                      placeholder="Same Day Report, 3-4 Hours"
                      value={testForm.turnaroundTime}
                      onChange={(e) => setTestForm({ ...testForm, turnaroundTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Parameters Count
                    </label>
                    <input
                      type="number"
                      value={testForm.parametersCount}
                      onChange={(e) => setTestForm({ ...testForm, parametersCount: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 pt-3">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        checked={testForm.fastingRequired}
                        onChange={(e) => setTestForm({ ...testForm, fastingRequired: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-700 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Fasting Required?</span>
                    </label>
                  </div>

                  {testForm.fastingRequired && (
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Fasting Hours</label>
                      <input
                        type="number"
                        placeholder="e.g. 10 or 12"
                        value={testForm.fastingHours}
                        onChange={(e) => setTestForm({ ...testForm, fastingHours: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Clinical Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of what this diagnostic test checks..."
                    value={testForm.description}
                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Patient Preparation Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 10 hours overnight fasting mandatory. Drink plenty of water."
                    value={testForm.preparationNotes}
                    onChange={(e) => setTestForm({ ...testForm, preparationNotes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  ></textarea>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={testForm.isPopular}
                      onChange={(e) => setTestForm({ ...testForm, isPopular: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-700 text-teal-600"
                    />
                    <span>Highlight as Popular</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={testForm.isPackage}
                      onChange={(e) => setTestForm({ ...testForm, isPackage: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-700 text-teal-600"
                    />
                    <span>Is Combined Health Package</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={testForm.active}
                      onChange={(e) => setTestForm({ ...testForm, active: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-700 text-teal-600"
                    />
                    <span>Active in Public Catalog</span>
                  </label>
                </div>

                {testForm.isPackage && (
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Package Included Tests (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="CBC, Fasting Glucose, Lipid Profile, SGPT, Creatinine, ECG"
                      value={testForm.packageTests}
                      onChange={(e) => setTestForm({ ...testForm, packageTests: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={savingTest}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition"
                  >
                    {savingTest
                      ? 'Saving...'
                      : editingTestId
                      ? 'Update Diagnostic Test'
                      : 'Add to Catalog'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTestModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
