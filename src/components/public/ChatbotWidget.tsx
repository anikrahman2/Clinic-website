import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Calendar,
  AlertTriangle,
  Bot,
  User,
  CheckCircle,
  RefreshCw,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useHospital } from '../../context/HospitalContext.js';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isBookingPrompt?: boolean;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        'Hello! I am **Jharna Care Assistant** from Jharna Clinic & Hospital, Jashore.\n\nI can help you explore our doctors, clinic services, diagnostic facilities, and schedule an appointment.\n\n*Important: I cannot provide medical diagnoses or prescribe medications.* How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { doctors, services, settings } = useHospital();

  // Interactive booking modal within chat
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [bookingData, setBookingData] = useState({
    patientName: '',
    phone: '',
    doctor: '',
    department: 'General Medicine',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointmentTime: '10:00 AM',
    reason: 'General consultation',
  });
  const [confirmedId, setConfirmedId] = useState<string>('');
  const [bookingError, setBookingError] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        message: text,
        conversationId: conversationId || undefined,
      });

      if (res.conversationId) {
        setConversationId(res.conversationId);
      }

      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content:
          'I am having trouble connecting with the hospital system right now. For urgent help, please call our 24/7 reception at ' +
          (settings?.phone || '+880 1711-000000') +
          '.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSend(q);
  };

  const handleStartBooking = () => {
    if (doctors.length > 0 && !bookingData.doctor) {
      setBookingData((prev) => ({
        ...prev,
        doctor: doctors[0].name,
        department: doctors[0].specialty,
      }));
    }
    setBookingStep('form');
    setBookingError('');
    setIsBookingOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!bookingData.patientName || !bookingData.phone || !bookingData.doctor) {
      setBookingError('Please enter your name, phone number, and doctor.');
      return;
    }

    setLoading(true);
    setBookingError('');
    try {
      const res = await api.bookAppointmentViaChat(bookingData);
      if (res.success && res.appointmentId) {
        setConfirmedId(res.appointmentId);
        setBookingStep('success');

        // Add confirmation message to chat transcript
        const botConfirm: Message = {
          id: 'bot-confirmed-' + Date.now(),
          role: 'assistant',
          content: `✅ **Appointment Booked Successfully!**\n\n- **Tracking ID**: \`${res.appointmentId}\`\n- **Patient**: ${bookingData.patientName}\n- **Doctor**: ${bookingData.doctor}\n- **Date & Time**: ${bookingData.appointmentDate} at ${bookingData.appointmentTime}\n\nOur hospital desk will call you at **${bookingData.phone}** to confirm your consultation schedule.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botConfirm]);
      }
    } catch (err: any) {
      setBookingError(err.message || 'Failed to submit appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white p-4 rounded-full shadow-2xl transition duration-300 transform hover:scale-105 active:scale-95"
            aria-label="Open Jharna Care Assistant"
          >
            <div className="relative">
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            </div>
            <span className="hidden sm:inline-block font-semibold text-sm pr-1">
              Jharna Care Assistant
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-teal-100">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Jharna Care Assistant</h3>
                <div className="flex items-center gap-1.5 text-xs text-teal-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Online • Jharna Clinic & Hospital</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Safety Notice Banner */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-3 py-1.5 flex items-center gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="leading-tight text-[11px]">
              Informational tool only. For acute emergencies, call <strong>{settings?.emergencyPhone || '[Emergency Number]'}</strong>.
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs leading-relaxed whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs pl-2">
                <div className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>Jharna Care is checking hospital records...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleQuickQuestion('Which doctors are available?')}
              className="text-xs shrink-0 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              🩺 Doctors List
            </button>
            <button
              onClick={handleStartBooking}
              className="text-xs shrink-0 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold px-2.5 py-1 rounded-full border border-teal-200 transition flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              Book Appointment
            </button>
            <button
              onClick={() => handleQuickQuestion('Where is Jharna Clinic located?')}
              className="text-xs shrink-0 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition"
            >
              📍 Location
            </button>
            <button
              onClick={() => handleQuickQuestion('Can you diagnose my illness?')}
              className="text-xs shrink-0 bg-rose-50 hover:bg-rose-100 text-rose-800 font-medium px-2.5 py-1 rounded-full border border-rose-200 transition"
            >
              ⚠️ Safety Check
            </button>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about doctors, services, appointments..."
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-md transition"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Interactive In-Chat Appointment Booking Modal */}
          {isBookingOpen && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 z-50">
              <div className="bg-white w-full rounded-2xl p-5 shadow-2xl border border-slate-200 max-h-[92%] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Appointment via Chat</span>
                  </div>
                  <button
                    onClick={() => setIsBookingOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {bookingStep === 'form' && (
                  <div className="mt-3 space-y-3 text-xs">
                    {bookingError && (
                      <div className="p-2 rounded bg-rose-50 text-rose-700 text-xs">
                        {bookingError}
                      </div>
                    )}
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Patient Full Name *</label>
                      <input
                        type="text"
                        value={bookingData.patientName}
                        onChange={(e) => setBookingData({ ...bookingData, patientName: e.target.value })}
                        placeholder="e.g. Mohammad Rahim"
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Phone Number (Bangladesh) *</label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        placeholder="e.g. 01711-XXXXXX"
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Select Doctor *</label>
                      <select
                        value={bookingData.doctor}
                        onChange={(e) => {
                          const doc = doctors.find((d) => d.name === e.target.value);
                          setBookingData({
                            ...bookingData,
                            doctor: e.target.value,
                            department: doc?.specialty || bookingData.department,
                          });
                        }}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-600 outline-none bg-white"
                      >
                        {doctors.map((d) => (
                          <option key={d._id} value={d.name}>
                            {d.name} ({d.specialty})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Preferred Date *</label>
                        <input
                          type="date"
                          value={bookingData.appointmentDate}
                          onChange={(e) => setBookingData({ ...bookingData, appointmentDate: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Preferred Time *</label>
                        <select
                          value={bookingData.appointmentTime}
                          onChange={(e) => setBookingData({ ...bookingData, appointmentTime: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none bg-white"
                        >
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="04:30 PM">04:30 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                          <option value="07:30 PM">07:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!bookingData.patientName || !bookingData.phone) {
                            setBookingError('Please enter your name and phone number.');
                            return;
                          }
                          setBookingStep('confirm');
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition"
                      >
                        Review & Confirm Details
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 'confirm' && (
                  <div className="mt-3 space-y-3 text-xs">
                    <p className="text-slate-600">
                      Please confirm your appointment details before we register it with our hospital desk:
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                      <div><strong>Patient:</strong> {bookingData.patientName}</div>
                      <div><strong>Phone:</strong> {bookingData.phone}</div>
                      <div><strong>Doctor:</strong> {bookingData.doctor}</div>
                      <div><strong>Department:</strong> {bookingData.department}</div>
                      <div><strong>Date & Time:</strong> {bookingData.appointmentDate} at {bookingData.appointmentTime}</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setBookingStep('form')}
                        className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleConfirmSubmit}
                        disabled={loading}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition"
                      >
                        {loading ? 'Submitting...' : 'Confirm Request'}
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 'success' && (
                  <div className="mt-3 text-center py-4 space-y-3">
                    <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-900 text-sm">Appointment Registered!</h4>
                    <p className="text-xs text-slate-600">
                      Your reference tracking code is:
                    </p>
                    <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 font-mono font-bold px-3 py-1.5 rounded-lg text-sm">
                      {confirmedId}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Our hospital staff in Jashore will contact you shortly to confirm your visit.
                    </p>
                    <button
                      onClick={() => setIsBookingOpen(false)}
                      className="w-full bg-teal-600 text-white text-xs font-semibold py-2 rounded-lg mt-2"
                    >
                      Back to Conversation
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
