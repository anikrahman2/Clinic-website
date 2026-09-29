import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
  Home,
  Building,
  CreditCard,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../services/api.js';

export function CartDrawer() {
  const {
    cart,
    removeFromCart,
    clearCart,
    subtotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { showToast } = useToast();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [collectionType, setCollectionType] = useState<'Hospital Visit' | 'Home Sample Collection'>(
    'Hospital Visit'
  );
  const [patientData, setPatientData] = useState({
    patientName: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    address: '',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredTimeSlot: 'Morning (08:00 AM - 11:30 AM)',
    paymentMethod: 'Cash on Collection / Counter' as const,
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const collectionFee = collectionType === 'Home Sample Collection' ? (subtotal >= 2000 ? 0 : 100) : 0;
  const totalAmount = subtotal + collectionFee;

  const anyFastingRequired = cart.some((item) => item.fastingRequired);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData.patientName || !patientData.phone || !patientData.age) {
      showToast('Please fill in patient name, phone, and age.', 'error');
      return;
    }

    if (collectionType === 'Home Sample Collection' && !patientData.address) {
      showToast('Please enter your home address in Jashore for sample collection.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createTestOrder({
        ...patientData,
        age: Number(patientData.age),
        collectionType,
        items: cart.map((c) => ({
          testId: c._id,
          name: c.name,
          code: c.code,
          price: c.discountPrice || c.price,
        })),
      });

      if (res.success && res.orderId) {
        setConfirmedOrder(res.data);
        setCheckoutStep('success');
        clearCart();
        showToast('Diagnostic test order confirmed!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Order booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    showToast('Order ID copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in font-sans">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Diagnostic Test Basket
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {cart.length} test{cart.length === 1 ? '' : 's'} selected
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutStep('cart');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {checkoutStep === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">Your test basket is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Browse our diagnostic catalog to select lab tests, blood profiles, and health checkup packages.
                  </p>
                </div>
              ) : (
                <>
                  {/* Fasting Alert notice */}
                  {anyFastingRequired && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <strong>Fasting Required:</strong> One or more tests in your basket require 10-12 hours overnight fasting. You may drink water.
                      </div>
                    </div>
                  )}

                  {/* Cart items list */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-start justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                              {item.code}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 truncate">
                              {item.sampleType}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs pt-1">
                            <span className="font-extrabold text-teal-700 text-sm">
                              ৳{item.discountPrice || item.price}
                            </span>
                            {item.discountPrice && (
                              <span className="text-slate-400 line-through text-[11px]">
                                ৳{item.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition"
                          title="Remove test"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Sample Collection Mode Toggle */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Sample Collection Mode
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCollectionType('Hospital Visit')}
                        className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                          collectionType === 'Hospital Visit'
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Building className="w-4 h-4 text-teal-600" />
                          <span>Hospital Visit</span>
                        </div>
                        <span className="text-[10px] text-teal-700 font-semibold">Free • Lab Desk</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCollectionType('Home Sample Collection')}
                        className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                          collectionType === 'Home Sample Collection'
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Home className="w-4 h-4 text-teal-600" />
                          <span>Home Collection</span>
                        </div>
                        <span className="text-[10px] text-teal-700 font-semibold">
                          {subtotal >= 2000 ? 'FREE (Orders ৳2000+)' : '+৳100 in Jashore'}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Checkout Form Step */}
          {checkoutStep === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-sm">Patient & Schedule Details</h4>
                <p className="text-[11px] text-slate-500">
                  Enter patient details for accurate lab registration and verified reports.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={patientData.patientName}
                  onChange={(e) => setPatientData({ ...patientData, patientName: e.target.value })}
                  placeholder="e.g. Mohammad Rahim"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={patientData.phone}
                    onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                    placeholder="01711-XXXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={patientData.email}
                    onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                    placeholder="patient@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    placeholder="e.g. 35"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={patientData.gender}
                    onChange={(e) => setPatientData({ ...patientData, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={patientData.preferredDate}
                    onChange={(e) => setPatientData({ ...patientData, preferredDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot *</label>
                  <select
                    value={patientData.preferredTimeSlot}
                    onChange={(e) => setPatientData({ ...patientData, preferredTimeSlot: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="Morning (08:00 AM - 11:30 AM)">Morning (08:00 AM - 11:30 AM)</option>
                    <option value="Midday (11:30 AM - 02:00 PM)">Midday (11:30 AM - 02:00 PM)</option>
                    <option value="Afternoon (04:00 PM - 07:00 PM)">Afternoon (04:00 PM - 07:00 PM)</option>
                  </select>
                </div>
              </div>

              {collectionType === 'Home Sample Collection' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Home Address in Jashore (Required for home pickup) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={patientData.address}
                    onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                    placeholder="House/Holding no, Road, Area/Moholla in Jashore..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600 resize-none"
                  ></textarea>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={patientData.paymentMethod}
                  onChange={(e) => setPatientData({ ...patientData, paymentMethod: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-teal-600"
                >
                  <option value="Cash on Collection / Counter">Cash on Collection / Hospital Counter</option>
                  <option value="bKash / Nagad">bKash / Nagad Mobile Banking</option>
                  <option value="Card at Hospital Desk">Debit / Credit Card at Desk</option>
                </select>
              </div>
            </form>
          )}

          {/* Success Step */}
          {checkoutStep === 'success' && confirmedOrder && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Booking Confirmed
                </span>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Diagnostic Order Received!
                </h4>
                <p className="text-xs text-slate-600">
                  Thank you, <strong>{confirmedOrder.patientName}</strong>. Your lab slot is registered.
                </p>
              </div>

              {/* Order ID code */}
              <div className="bg-slate-50 border-2 border-teal-300 rounded-2xl p-4 flex items-center justify-between max-w-sm mx-auto">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Diagnostic Order ID
                  </span>
                  <span className="font-mono font-extrabold text-teal-800 text-lg">
                    {confirmedOrder.orderId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyOrderId(confirmedOrder.orderId)}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Receipt Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <strong>Total Amount:</strong>
                  <span className="font-bold text-teal-800">৳{confirmedOrder.totalAmount} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection Type:</span>
                  <span className="font-semibold">{confirmedOrder.collectionType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled Date:</span>
                  <span>{confirmedOrder.preferredDate} ({confirmedOrder.preferredTimeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tests:</span>
                  <span>{confirmedOrder.items?.length || 0} Test(s)</span>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-[11px] text-teal-900 text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  Our phlebotomist or reception desk in Jashore will contact you at <strong>{confirmedOrder.phone}</strong> to confirm your sample intake.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
          {checkoutStep === 'cart' && cart.length > 0 && (
            <>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tests Subtotal:</span>
                  <span className="font-bold text-slate-900">৳{subtotal}</span>
                </div>
                {collectionType === 'Home Sample Collection' && (
                  <div className="flex justify-between text-teal-700">
                    <span>Home Sample Pickup Fee:</span>
                    <span>{collectionFee === 0 ? 'FREE (Order ৳2000+)' : `৳${collectionFee}`}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-teal-700 text-base">৳{totalAmount} BDT</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
              >
                Proceed to Checkout ({cart.length} Tests)
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {checkoutStep === 'checkout' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl text-xs transition"
              >
                Back to Basket
              </button>
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="w-2/3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-md text-xs transition"
              >
                {submitting ? 'Confirming Order...' : `Confirm Booking (৳${totalAmount})`}
              </button>
            </div>
          )}

          {checkoutStep === 'success' && (
            <button
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutStep('cart');
                setConfirmedOrder(null);
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition"
            >
              Continue Browsing Tests
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
