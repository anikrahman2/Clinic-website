import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ShoppingBag,
  Check,
  Plus,
  Clock,
  AlertTriangle,
  Info,
  ShieldCheck,
  Flame,
  PackageCheck,
  FileText,
  Home,
  ChevronRight,
  X,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useCart } from '../../context/CartContext.js';
import { useToast } from '../../context/ToastContext.js';
import type { DiagnosticTest } from '../../types/index.js';

export function Diagnostics() {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [filterFastingOnly, setFilterFastingOnly] = useState(false);
  const [filterPackagesOnly, setFilterPackagesOnly] = useState(false);
  const [selectedTestDetail, setSelectedTestDetail] = useState<DiagnosticTest | null>(null);

  // Tracking state
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const { addToCart, isInCart, setIsCartOpen, totalCount, subtotal } = useCart();
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

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.getDiagnosticTests({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        sortBy,
        activeOnly: true,
      });
      if (res.success && Array.isArray(res.data)) {
        setTests(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load diagnostic catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTests();
  };

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      if (filterFastingOnly && !t.fastingRequired) return false;
      if (filterPackagesOnly && !t.isPackage) return false;
      return true;
    });
  }, [tests, filterFastingOnly, filterPackagesOnly]);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const res = await api.getTestOrderById(trackingId.trim());
      if (res.success && res.data) {
        setTrackingResult(res.data);
      } else {
        setTrackingError('No diagnostic order found with this tracking ID.');
      }
    } catch (err: any) {
      setTrackingError(err.message || 'Order not found. Please verify the code.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-700/50 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Pathology & Digital Radiology Store
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Book Diagnostic Tests &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-200">
                Health Checkup Packages
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              Order blood tests, hormone panels, pregnancy scans, and whole-body checkup packages with verified reports. Choose between hospital lab visit or home sample collection in Jashore.
            </p>

            {/* Value Props Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs text-teal-100 font-medium">
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated Analyzers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <Clock className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>Same Day Reports</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <Home className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Home Sample Pickup</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <FileText className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Online Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* E-Commerce Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tests (e.g. CBC, HbA1c, Thyroid, Lipid, X-Ray)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 transition"
              />
            </form>

            {/* Sort & Basket shortcut */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-semibold hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Test Basket</span>
                {totalCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full text-[10px] ml-1">
                    {totalCount} (৳{subtotal})
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <button
              onClick={() => setFilterPackagesOnly(!filterPackagesOnly)}
              className={`px-3 py-1 rounded-full border transition font-semibold flex items-center gap-1.5 ${
                filterPackagesOnly
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              Health Packages Only
            </button>

            <button
              onClick={() => setFilterFastingOnly(!filterFastingOnly)}
              className={`px-3 py-1 rounded-full border transition font-semibold flex items-center gap-1.5 ${
                filterFastingOnly
                  ? 'bg-teal-100 border-teal-300 text-teal-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Fasting Required Tests
            </button>

            {(filterPackagesOnly || filterFastingOnly) && (
              <button
                onClick={() => {
                  setFilterPackagesOnly(false);
                  setFilterFastingOnly(false);
                }}
                className="text-xs text-rose-600 font-semibold hover:underline ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Search className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No diagnostic tests found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or selecting a different category tab.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setFilterFastingOnly(false);
                setFilterPackagesOnly(false);
                fetchTests();
              }}
              className="mt-2 bg-teal-600 text-white font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Reset Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => {
              const inBasket = isInCart(test._id);
              const discountPct = test.discountPrice
                ? Math.round(((test.price - test.discountPrice) / test.price) * 100)
                : 0;

              return (
                <div
                  key={test._id}
                  className={`bg-white rounded-3xl border overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 ${
                    test.isPackage
                      ? 'border-amber-300/80 ring-1 ring-amber-200/50'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="p-6 space-y-3">
                    {/* Badges bar */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {test.code}
                        </span>
                        {test.isPackage && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" /> Package
                          </span>
                        )}
                        {test.isPopular && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-rose-500" /> Popular
                          </span>
                        )}
                      </div>

                      {discountPct > 0 && (
                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {discountPct}% OFF
                        </span>
                      )}
                    </div>

                    {/* Test Title & Description */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug hover:text-teal-700 transition">
                        {test.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {test.description}
                      </p>
                    </div>

                    {/* Key Specifications (Turnaround, fasting, parameters) */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="font-medium">{test.turnaroundTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>Sample: <strong>{test.sampleType}</strong></span>
                      </div>
                      {test.fastingRequired ? (
                        <div className="flex items-center gap-2 text-amber-700 font-semibold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Fasting required ({test.fastingHours} hrs)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-700 text-[11px] font-medium">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>No fasting required</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Add to Cart Action Footer */}
                  <div className="p-6 pt-0 border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Test Price
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-slate-900">
                          ৳{test.discountPrice || test.price}
                        </span>
                        {test.discountPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{test.price}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-semibold">BDT</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTestDetail(test)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-xs font-semibold"
                        title="View Full Test Details & Preparation"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => addToCart(test)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                          inBasket
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        {inBasket ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> In Basket
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Book Test
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Track Diagnostic Sample & Order Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Online Lab Tracking
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Track Diagnostic Sample & Report Status
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Have an existing test booking? Enter your Diagnostic Order ID (e.g. <code>JCH-DIAG-2026-004101</code>) to track your sample and report collection status.
              </p>
            </div>

            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="JCH-DIAG-XXXX-XXXXXX"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono font-bold focus:ring-2 focus:ring-teal-600 outline-none uppercase"
              />
              <button
                type="submit"
                disabled={trackingLoading || !trackingId.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-md"
              >
                {trackingLoading ? 'Checking...' : 'Track Sample'}
              </button>
            </form>

            {trackingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-center max-w-lg mx-auto">
                {trackingError}
              </div>
            )}

            {trackingResult && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-4 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs text-slate-500 block">Order Reference</span>
                    <strong className="text-base text-teal-800 font-mono">
                      {trackingResult.orderId}
                    </strong>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    {trackingResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                  <div><strong>Patient:</strong> {trackingResult.patientName}</div>
                  <div><strong>Phone:</strong> {trackingResult.phone}</div>
                  <div><strong>Collection:</strong> {trackingResult.collectionType}</div>
                  <div><strong>Total Amount:</strong> ৳{trackingResult.totalAmount} BDT</div>
                  <div className="col-span-2">
                    <strong>Scheduled Slot:</strong> {trackingResult.preferredDate} ({trackingResult.preferredTimeSlot})
                  </div>
                </div>

                {/* Progress bar stages */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                    <span className="text-teal-700">1. Order Placed</span>
                    <span className={trackingResult.status !== 'Pending' ? 'text-teal-700' : ''}>
                      2. Sample Collected
                    </span>
                    <span className={trackingResult.status === 'Processing in Lab' || trackingResult.status === 'Report Ready' ? 'text-teal-700' : ''}>
                      3. Processing
                    </span>
                    <span className={trackingResult.status === 'Report Ready' ? 'text-emerald-700' : ''}>
                      4. Report Ready
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{
                        width:
                          trackingResult.status === 'Report Ready'
                            ? '100%'
                            : trackingResult.status === 'Processing in Lab'
                            ? '75%'
                            : trackingResult.status === 'Sample Collected'
                            ? '50%'
                            : '25%',
                      }}
                    ></div>
                  </div>
                </div>

                {trackingResult.reportNotes && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
                    <strong>Lab Desk Update:</strong> {trackingResult.reportNotes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal: Full Test Details & Guidelines */}
        {selectedTestDetail && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  {selectedTestDetail.code}
                </span>
                <button
                  onClick={() => setSelectedTestDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  {selectedTestDetail.category}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedTestDetail.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {selectedTestDetail.description}
                </p>
              </div>

              {/* Package tests checklist if package */}
              {selectedTestDetail.isPackage && selectedTestDetail.packageTests && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-teal-600" />
                    Included Tests in this Package ({selectedTestDetail.packageTests.length})
                  </h4>
                  <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-700 pt-1">
                    {selectedTestDetail.packageTests.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preparation guidelines */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                  Sample & Preparation Guidelines
                </h4>
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5 text-amber-950">
                  <div><strong>Sample Required:</strong> {selectedTestDetail.sampleType}</div>
                  <div>
                    <strong>Fasting Requirement:</strong>{' '}
                    {selectedTestDetail.fastingRequired
                      ? `Yes (${selectedTestDetail.fastingHours} hours fasting required)`
                      : 'No fasting required'}
                  </div>
                  <div><strong>Turnaround Time:</strong> {selectedTestDetail.turnaroundTime}</div>
                  {selectedTestDetail.preparationNotes && (
                    <div className="pt-1 text-[11px] text-amber-900">
                      <strong>Notes:</strong> {selectedTestDetail.preparationNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Total Test Price
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ৳{selectedTestDetail.discountPrice || selectedTestDetail.price}{' '}
                    <span className="text-xs text-slate-400 font-semibold">BDT</span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedTestDetail);
                    setSelectedTestDetail(null);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow-md flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Test Basket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
