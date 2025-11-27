
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MOCK_USERS, 
  INITIAL_TOURS 
} from './constants';
import { 
  User, 
  Tour, 
  Resource, 
  ResourceType, 
  ResourceStatus, 
  Comment, 
  Notification,
  UserRole,
  MealType
} from './types';
import { generateTourSummary } from './services/geminiService';

// --- Icons ---
const HotelIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const RestaurantIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const SearchIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const CheckIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const AlertIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const BellIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const AiIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const XIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const PencilIcon = () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const SendIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const ChatIcon = () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

// --- Helper Functions ---
const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const getDaysArray = (startDate: string, duration: number) => {
  const arr = [];
  for (let i = 0; i < duration; i++) {
    arr.push({
      dayNum: i + 1,
      date: addDays(startDate, i)
    });
  }
  return arr;
};

// --- Components ---

const Badge = ({ status, isOpConfirmed, isSalesConfirmed }: { status: ResourceStatus, isOpConfirmed?: boolean, isSalesConfirmed?: boolean }) => {
  // Dual confirmation check
  const isFullyConfirmed = isOpConfirmed && isSalesConfirmed;
  
  // Override status display if fully confirmed
  const effectiveStatus = isFullyConfirmed ? ResourceStatus.CONFIRMED : (status === ResourceStatus.CONFIRMED ? ResourceStatus.PROPOSED : status);

  const colors = {
    [ResourceStatus.SEARCHING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [ResourceStatus.PROPOSED]: 'bg-blue-100 text-blue-800 border-blue-200',
    [ResourceStatus.CONFIRMED]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [ResourceStatus.ISSUE]: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${colors[effectiveStatus]}`}>
      {effectiveStatus === ResourceStatus.CONFIRMED && <CheckIcon />}
      {effectiveStatus}
    </span>
  );
};

// Toast Notification Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed bottom-4 right-4 ${bgColors[type]} text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-[100] animate-fade-in-up`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1">
        <XIcon />
      </button>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">{message}</p>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const TourModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  tour, 
  onDelete 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (tour: Partial<Tour>) => void,
  tour?: Tour,
  onDelete?: (id: string) => void
}) => {
  const [formData, setFormData] = useState<Partial<Tour>>({
    code: '',
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 5,
  });

  useEffect(() => {
    if (tour) {
      setFormData(tour);
    } else {
      setFormData({
        code: '',
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        duration: 5,
      });
    }
  }, [tour, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            {tour ? 'Edit Tour Group' : 'New Tour Group'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XIcon />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tour Code</label>
            <input 
              type="text" 
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})}
              className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
              placeholder="#2025-11-01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tour Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
              placeholder="Japan Autumn Special"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input 
                type="date" 
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Days)</label>
               <input 
                 type="number" 
                 min="1"
                 value={formData.duration}
                 onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
                 className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
               />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-between items-center">
           {tour && onDelete ? (
             <button 
               onClick={() => onDelete(tour.id)}
               className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded"
             >
               <TrashIcon /> Delete Group
             </button>
           ) : <div></div>}
           <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
            <button 
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-primary hover:bg-slate-800 text-white rounded-lg transition-colors shadow-lg shadow-primary/30"
            >
              Save Tour
            </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ResourceModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  resource, 
  tour,
  days,
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (r: Partial<Resource>) => void,
  resource?: Resource,
  tour: Tour,
  days: {dayNum: number, date: string}[],
}) => {
  const [formData, setFormData] = useState<Partial<Resource>>({});

  useEffect(() => {
    if (resource) {
      setFormData(resource);
    } else {
      setFormData({
        type: ResourceType.HOTEL,
        status: ResourceStatus.SEARCHING,
        date: days[0]?.date || tour.startDate,
        amenities: [],
        hasElevator: false,
        hasAC: false,
        hasParking: false,
        cancellationDeadline: '',
        mealType: 'LUNCH',
        comments: []
      });
    }
  }, [resource, isOpen, tour, days]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {resource ? 'Edit Resource' : 'Add New Resource'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XIcon />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Top Row: Type, Status, Date */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as ResourceType})}
                    className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
                >
                    <option value={ResourceType.HOTEL}>Hotel</option>
                    <option value={ResourceType.RESTAURANT}>Restaurant</option>
                </select>
                </div>
                
                <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                <select 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
                >
                    {days.map(d => (
                    <option key={d.date} value={d.date}>Day {d.dayNum}: {d.date}</option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ResourceStatus})}
                    className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
                >
                    <option value={ResourceStatus.SEARCHING}>Searching</option>
                    <option value={ResourceStatus.PROPOSED}>Proposed</option>
                    <option value={ResourceStatus.CONFIRMED}>Confirmed</option>
                    <option value={ResourceStatus.ISSUE}>Issue</option>
                </select>
                </div>
            </div>

            {/* Name & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input 
                    type="text" 
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
                    placeholder="e.g. Grand Hotel"
                />
                </div>
                <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input 
                    type="text" 
                    value={formData.address || ''}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full rounded-lg border-slate-300 focus:ring-accent focus:border-accent"
                    placeholder="Full address"
                />
                </div>
            </div>

            {/* Hotel Specifics */}
            {formData.type === ResourceType.HOTEL && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                    <HotelIcon /> Hotel Details
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                    <label className="block text-xs text-slate-500 mb-1">Twin Price (€)</label>
                    <input type="number" value={formData.priceTwin || ''} onChange={e => setFormData({...formData, priceTwin: Number(e.target.value)})} className="w-full rounded border-slate-300 text-sm" />
                    </div>
                    <div>
                    <label className="block text-xs text-slate-500 mb-1">Single Price (€)</label>
                    <input type="number" value={formData.priceSingle || ''} onChange={e => setFormData({...formData, priceSingle: Number(e.target.value)})} className="w-full rounded border-slate-300 text-sm" />
                    </div>
                    <div>
                    <label className="block text-xs text-slate-500 mb-1">Triple Price (€)</label>
                    <input type="number" value={formData.priceTriple || ''} onChange={e => setFormData({...formData, priceTriple: Number(e.target.value)})} className="w-full rounded border-slate-300 text-sm" />
                    </div>
                </div>
                
                <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Free Cancellation Deadline (免取时间)</label>
                    <input 
                        type="datetime-local" 
                        value={formData.cancellationDeadline || ''}
                        onChange={e => setFormData({...formData, cancellationDeadline: e.target.value})}
                        className="w-full rounded border-slate-300 text-sm"
                    />
                </div>

                <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.hasElevator || false} onChange={e => setFormData({...formData, hasElevator: e.target.checked})} className="rounded text-primary focus:ring-primary" />
                        Elevator
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.hasAC || false} onChange={e => setFormData({...formData, hasAC: e.target.checked})} className="rounded text-primary focus:ring-primary" />
                        A/C
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.hasParking || false} onChange={e => setFormData({...formData, hasParking: e.target.checked})} className="rounded text-primary focus:ring-primary" />
                        Parking
                    </label>
                </div>
                </div>
            )}

            {/* Restaurant Specifics */}
            {formData.type === ResourceType.RESTAURANT && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                    <RestaurantIcon /> Restaurant Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-xs text-slate-500 mb-1">Meal Type</label>
                    <select 
                        value={formData.mealType || 'LUNCH'} 
                        onChange={e => setFormData({...formData, mealType: e.target.value as MealType})}
                        className="w-full rounded border-slate-300 text-sm"
                    >
                        <option value="LUNCH">Lunch</option>
                        <option value="DINNER">Dinner</option>
                    </select>
                    </div>
                    <div>
                    <label className="block text-xs text-slate-500 mb-1">Avg Price (€)</label>
                    <input type="number" value={formData.avgPrice || ''} onChange={e => setFormData({...formData, avgPrice: Number(e.target.value)})} className="w-full rounded border-slate-300 text-sm" />
                    </div>
                    <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Menu Link</label>
                    <input type="text" value={formData.menuLink || ''} onChange={e => setFormData({...formData, menuLink: e.target.value})} className="w-full rounded border-slate-300 text-sm" placeholder="https://..." />
                    </div>
                </div>
                </div>
            )}
        </div>

        <div className="bg-white px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
            <button 
                onClick={() => onSave(formData)}
                className="px-4 py-2 bg-primary hover:bg-slate-800 text-white rounded-lg transition-colors shadow-lg shadow-primary/30"
            >
                Save Resource
            </button>
        </div>
      </div>
    </div>
  );
};

const InlineChat = ({ 
  resource, 
  currentUser, 
  onAddComment, 
  onUpdateComment 
}: { 
  resource: Resource, 
  currentUser: User, 
  onAddComment: (id: string, text: string) => void,
  onUpdateComment: (resId: string, cid: string, text: string) => void
}) => {
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const handleSend = () => {
        if(newComment.trim()) {
            onAddComment(resource.id, newComment);
            setNewComment("");
        }
    };

    const handleUpdate = (cid: string) => {
        if(editText.trim()) {
            onUpdateComment(resource.id, cid, editText);
            setEditingId(null);
        }
    }

    return (
        <div className="bg-slate-50/50 p-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
               <ChatIcon /> Team Chat
            </div>
            {resource.comments.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar mb-1 pr-1">
                    {resource.comments.map(c => (
                        <div key={c.id} className={`flex flex-col ${c.userId === currentUser.id ? 'items-end' : 'items-start'} group`}>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[10px] font-bold text-slate-600">{c.userName}</span>
                                <span className="text-[9px] text-slate-400">{new Date(c.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                {c.userId === currentUser.id && editingId !== c.id && (
                                    <button 
                                        onClick={() => { setEditingId(c.id); setEditText(c.content); }}
                                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-accent transition-opacity"
                                    >
                                        <PencilIcon />
                                    </button>
                                )}
                            </div>
                            
                            {editingId === c.id ? (
                                <div className="flex flex-col gap-1 w-full max-w-[90%]">
                                    <input 
                                        className="text-xs rounded border-slate-300 p-1 w-full"
                                        value={editText}
                                        onChange={e => setEditText(e.target.value)}
                                        autoFocus
                                        onKeyDown={e => e.key === 'Enter' && handleUpdate(c.id)}
                                    />
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => setEditingId(null)} className="text-[9px] text-slate-500 hover:underline">Cancel</button>
                                        <button onClick={() => handleUpdate(c.id)} className="text-[9px] text-accent hover:underline font-bold">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <div className={`px-2 py-1.5 rounded-lg text-xs leading-relaxed max-w-[95%] break-words ${
                                    c.userId === currentUser.id 
                                    ? 'bg-blue-100 text-blue-900 rounded-tr-none' 
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                }`}>
                                    {c.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex gap-2">
                <input 
                    className="flex-1 rounded-md border-slate-200 text-xs px-2 py-1.5 focus:ring-accent focus:border-accent bg-white shadow-sm"
                    placeholder="Type a message..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    className="bg-white border border-slate-200 text-slate-500 hover:text-accent hover:border-accent p-1.5 rounded-md shadow-sm transition-colors"
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};

// --- Main App ---

export default function App() {
  const [activeTourId, setActiveTourId] = useState<string | null>(INITIAL_TOURS[0]?.id || null);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tours, setTours] = useState<Tour[]>(INITIAL_TOURS);
  
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | undefined>(undefined);
  
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>(undefined);
  const [selectedDayForNewResource, setSelectedDayForNewResource] = useState<string | null>(null);

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);

  // Helper to check tour completion
  const isTourCompleted = (tour: Tour) => {
      // Must have at least one resource and all must be confirmed by both parties
      return tour.resources.length > 0 && tour.resources.every(r => r.isOpConfirmed && r.isSalesConfirmed);
  };

  // Sort tours: Incomplete first, Complete last
  const sortedTours = useMemo(() => {
      return [...tours].sort((a, b) => {
          const aComplete = isTourCompleted(a);
          const bComplete = isTourCompleted(b);
          if (aComplete === bComplete) return 0;
          return aComplete ? 1 : -1;
      });
  }, [tours]);

  const activeTour = useMemo(() => tours.find(t => t.id === activeTourId), [tours, activeTourId]);

  const tourDays = useMemo(() => {
    if (!activeTour) return [];
    return getDaysArray(activeTour.startDate, activeTour.duration);
  }, [activeTour]);

  const resourcesByDate = useMemo(() => {
    if (!activeTour) return {};
    const grouped: {[key: string]: Resource[]} = {};
    tourDays.forEach(day => { grouped[day.date] = []; });
    activeTour.resources.forEach(r => {
      if (!grouped[r.date]) grouped[r.date] = [];
      grouped[r.date].push(r);
    });
    return grouped;
  }, [activeTour, tourDays]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleCreateTour = (tourData: Partial<Tour>) => {
    const newTour: Tour = {
      id: `t${Date.now()}`,
      code: tourData.code!,
      name: tourData.name!,
      startDate: tourData.startDate!,
      duration: tourData.duration || 5,
      resources: []
    };
    setTours([...tours, newTour]);
    setActiveTourId(newTour.id);
    setIsTourModalOpen(false);
    showToast(`Tour "${newTour.code}" created successfully`, 'success');
  };

  const handleUpdateTour = (tourData: Partial<Tour>) => {
     setTours(tours.map(t => t.id === editingTour?.id ? { ...t, ...tourData } as Tour : t));
     setIsTourModalOpen(false);
     setEditingTour(undefined);
     showToast('Tour updated', 'success');
  };

  const handleDeleteTour = (tourId: string) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Tour Group',
      message: 'Are you sure you want to delete this tour? All resources, comments, and history associated with this tour will be permanently deleted.',
      onConfirm: () => executeDeleteTour(tourId)
    });
  };

  const executeDeleteTour = (tourId: string) => {
    const tourToDelete = tours.find(t => t.id === tourId);
    setTours(prev => prev.filter(t => t.id !== tourId));
    if (activeTourId === tourId) setActiveTourId(null);
    setIsTourModalOpen(false);
    setConfirmationModal(null);
    setNotifications(prev => prev.filter(n => n.tourId !== tourId));
    showToast(`Tour ${tourToDelete?.code} deleted`, 'success');
  };

  const handleSaveResource = (rData: Partial<Resource>) => {
    if (!activeTour) return;

    if (editingResource) {
      // Update
      const updatedResource = { ...editingResource, ...rData, lastUpdated: Date.now() };
      const updatedResources = activeTour.resources.map(r => r.id === updatedResource.id ? updatedResource : r);
      setTours(tours.map(t => t.id === activeTour.id ? { ...t, resources: updatedResources } : t));
      showToast('Resource updated', 'success');
    } else {
      // Create
      const newResource: Resource = {
        id: `r${Date.now()}`,
        tourId: activeTour.id,
        type: rData.type || ResourceType.HOTEL,
        date: rData.date || activeTour.startDate,
        name: rData.name || 'New Resource',
        address: rData.address || '',
        status: rData.status || ResourceStatus.SEARCHING,
        assignedTo: currentUser.id,
        comments: [],
        history: [],
        lastUpdated: Date.now(),
        isOpConfirmed: false,
        isSalesConfirmed: false,
        ...rData
      } as Resource;
      
      const updatedResources = [...activeTour.resources, newResource];
      setTours(tours.map(t => t.id === activeTour.id ? { ...t, resources: updatedResources } : t));
      
      if (currentUser.role === 'OP') {
          addNotification(`New resource added: ${newResource.name}`, newResource.id);
      }
      showToast('Resource created', 'success');
    }
    setIsResourceModalOpen(false);
    setEditingResource(undefined);
  };

  const handleToggleConfirmation = (resource: Resource, role: UserRole) => {
    if (!activeTour) return;
    if (currentUser.role !== role) {
        showToast(`Only ${role} can perform this action`, 'error');
        return;
    }

    const updatedResource = { ...resource };
    if (role === 'OP') {
        updatedResource.isOpConfirmed = !Boolean(resource.isOpConfirmed);
    } else {
        updatedResource.isSalesConfirmed = !Boolean(resource.isSalesConfirmed);
    }

    if (updatedResource.isOpConfirmed && updatedResource.isSalesConfirmed) {
        updatedResource.status = ResourceStatus.CONFIRMED;
    } else if (updatedResource.status === ResourceStatus.CONFIRMED) {
        updatedResource.status = ResourceStatus.PROPOSED;
    } else if (updatedResource.status === ResourceStatus.SEARCHING || updatedResource.status === ResourceStatus.ISSUE) {
        updatedResource.status = ResourceStatus.PROPOSED;
    }

    const updatedResources = activeTour.resources.map(r => r.id === resource.id ? updatedResource : r);
    setTours(tours.map(t => t.id === activeTour.id ? { ...t, resources: updatedResources } : t));
    
    const action = (role === 'OP' ? updatedResource.isOpConfirmed : updatedResource.isSalesConfirmed) ? 'verified' : 'unverified';
    showToast(`${role} ${action} ${resource.name}`, 'info');
  };

  const handleReadOnlyClick = (expectedRole: UserRole) => {
      showToast(`Please switch to ${expectedRole} account to verify.`, 'info');
  };

  const handleAddComment = (resourceId: string, content: string) => {
    if (!activeTour) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content,
      timestamp: Date.now()
    };
    const updatedResources = activeTour.resources.map(r => r.id === resourceId ? { ...r, comments: [...r.comments, newComment] } : r);
    setTours(tours.map(t => t.id === activeTour.id ? { ...t, resources: updatedResources } : t));
    addNotification(`New comment on resource`, resourceId);
  };

  const handleUpdateComment = (resourceId: string, commentId: string, newContent: string) => {
    if (!activeTour) return;
    const updatedResources = activeTour.resources.map(r => {
        if (r.id === resourceId) {
            return { ...r, comments: r.comments.map(c => c.id === commentId ? { ...c, content: newContent } : c) };
        }
        return r;
    });
    setTours(tours.map(t => t.id === activeTour.id ? { ...t, resources: updatedResources } : t));
    showToast('Comment updated', 'success');
  };

  const addNotification = (message: string, resourceId: string) => {
      if (!activeTour) return;
      const newNotif: Notification = {
          id: `n${Date.now()}`,
          resourceId,
          tourId: activeTour.id,
          message,
          timestamp: Date.now(),
          read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const generateReport = async () => {
    if (!activeTour) return;
    setIsGeneratingReport(true);
    setAiReport(null);
    const report = await generateTourSummary(activeTour);
    setAiReport(report);
    setIsGeneratingReport(false);
  };

  const updateUserName = (name: string) => {
      const updatedUser = { ...currentUser, name };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-slate-300 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="bg-accent rounded-lg p-1">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
            TourOps
          </h1>
        </div>

        <div className="p-4 border-b border-slate-700/50">
           <div className="flex items-center gap-3 mb-3">
              <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-600" />
              <div>
                 <input 
                   className="bg-transparent border-none text-white font-semibold w-full focus:ring-0 p-0 text-sm"
                   value={currentUser.name}
                   onChange={(e) => updateUserName(e.target.value)}
                 />
                 <span className={`text-xs px-1.5 py-0.5 rounded ${currentUser.role === 'OP' ? 'bg-indigo-900 text-indigo-300' : 'bg-pink-900 text-pink-300'}`}>
                    {currentUser.role}
                 </span>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-2">
             {users.map(u => (
               <button 
                 key={u.id}
                 onClick={() => setCurrentUser(u)}
                 className={`text-xs py-1.5 rounded-md transition-all ${currentUser.id === u.id ? 'bg-slate-700 text-white shadow-inner' : 'hover:bg-slate-800 text-slate-400'}`}
               >
                 {u.role}
               </button>
             ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Tours</span>
            <button 
              onClick={() => { setEditingTour(undefined); setIsTourModalOpen(true); }}
              className="text-accent hover:text-blue-400"
            >
              <PlusIcon />
            </button>
          </div>
          
          {sortedTours.map(tour => {
             const complete = isTourCompleted(tour);
             return (
            <div 
              key={tour.id}
              onClick={() => setActiveTourId(tour.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border border-transparent ${activeTourId === tour.id ? 'bg-slate-800 border-slate-700 text-white shadow-lg' : 'hover:bg-slate-800/50 text-slate-400'}`}
            >
              <div className="truncate flex-1">
                <div className="font-medium text-sm truncate flex items-center gap-2">
                    {tour.code}
                    {complete && <span className="text-emerald-500"><CheckIcon /></span>}
                </div>
                <div className="text-xs opacity-70 truncate">{tour.name}</div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteTour(tour.id); }}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 rounded transition-opacity"
              >
                <TrashIcon />
              </button>
            </div>
          )})}
          {tours.length === 0 && <div className="text-center py-8 text-slate-600 text-xs">No tours available.</div>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            {activeTour ? (
              <>
                 <h2 className="text-xl font-bold text-slate-800">{activeTour.code}</h2>
                 <span className="text-slate-400">|</span>
                 <span className="text-slate-600 text-sm">{activeTour.name}</span>
                 <button 
                   onClick={() => { setEditingTour(activeTour); setIsTourModalOpen(true); }}
                   className="text-slate-400 hover:text-accent transition-colors"
                 >
                   <EditIcon />
                 </button>
              </>
            ) : (
              <h2 className="text-xl font-bold text-slate-400">No Tour Selected</h2>
            )}
          </div>

          <div className="flex items-center gap-4">
             {/* Notifications */}
             <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`p-2 rounded-full transition-colors relative ${isNotificationsOpen ? 'bg-blue-50 text-accent' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                   <BellIcon />
                   {notifications.filter(n => !n.read).length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                     <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h4 className="font-semibold text-slate-700 text-sm">Notifications</h4>
                        {notifications.length > 0 && (
                          <button onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} className="text-xs text-accent hover:underline">Mark all read</button>
                        )}
                     </div>
                     <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">No notifications</div> : (
                            notifications.map(n => (
                              <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-blue-50/40' : ''}`}>
                                 <p className={`text-sm mb-1 ${!n.read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.message}</p>
                                 <span className="text-xs text-slate-400">{new Date(n.timestamp).toLocaleTimeString()}</span>
                              </div>
                            ))
                        )}
                     </div>
                  </div>
                )}
             </div>

             {activeTour && (
                <button 
                onClick={generateReport}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium"
                >
                <AiIcon />
                {isGeneratingReport ? 'Analyzing...' : 'AI Summary'}
                </button>
             )}
          </div>
        </header>

        {!activeTour ? (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50">
              <h3 className="text-xl font-semibold text-slate-400">Select or Create a Tour Group</h3>
           </div>
        ) : (
          <div className="flex-1 overflow-auto p-6 scroll-smooth">
            {aiReport && (
              <div className="mb-8 bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-3 border-b border-indigo-50 flex justify-between items-center">
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2"><AiIcon /> AI Executive Summary</h3>
                  <button onClick={() => setAiReport(null)} className="text-slate-400 hover:text-slate-600"><XIcon /></button>
                </div>
                <div className="p-6 text-sm text-slate-700 whitespace-pre-line leading-relaxed font-mono bg-slate-50/30">
                  {aiReport}
                </div>
              </div>
            )}

            <div className="space-y-8 pb-20">
              {tourDays.map((day) => {
                const dayResources = resourcesByDate[day.date] || [];
                return (
                  <div key={day.date} className="relative">
                    <div className="flex items-center gap-4 mb-4 sticky top-0 bg-slate-50 z-10 py-2">
                       <div className="bg-primary text-white px-3 py-1 rounded-md text-sm font-bold shadow-md">Day {day.dayNum}</div>
                       <div className="h-px bg-slate-200 flex-1"></div>
                       <span className="text-slate-400 text-sm font-medium flex items-center gap-1"><CalendarIcon /> {day.date}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                      {dayResources.map(resource => {
                        const isFullyConfirmed = resource.isOpConfirmed && resource.isSalesConfirmed;
                        return (
                        <div key={resource.id} className={`bg-white rounded-xl border transition-all hover:shadow-lg group flex flex-col ${isFullyConfirmed ? 'border-emerald-200 shadow-emerald-50' : 'border-slate-200 shadow-sm'}`}>
                          <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-gradient-to-br from-white to-slate-50 rounded-t-xl">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${resource.type === ResourceType.HOTEL ? 'bg-orange-100 text-orange-600' : 'bg-pink-100 text-pink-600'}`}>
                                {resource.type === ResourceType.HOTEL ? <HotelIcon /> : <RestaurantIcon />}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                  {resource.name}
                                  {isFullyConfirmed && <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold tracking-wider">OK</span>}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                  {resource.type === ResourceType.RESTAURANT && <span className="px-1.5 py-0 rounded text-[10px] font-medium bg-slate-100">{resource.mealType}</span>}
                                  {resource.address || 'No address'}
                                </p>
                              </div>
                            </div>
                            <Badge status={resource.status} isOpConfirmed={resource.isOpConfirmed} isSalesConfirmed={resource.isSalesConfirmed}/>
                          </div>

                          <div className="p-4 space-y-3 flex-1">
                            {/* Key Info */}
                            <div className="flex flex-wrap gap-2">
                               {resource.type === ResourceType.HOTEL && (
                                 <>
                                   <div title="Elevator" className={`text-xs px-2 py-1 rounded border ${resource.hasElevator ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400 line-through'}`}>Elevator</div>
                                   <div title="AC" className={`text-xs px-2 py-1 rounded border ${resource.hasAC ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400 line-through'}`}>A/C</div>
                                   <div title="Parking" className={`text-xs px-2 py-1 rounded border ${resource.hasParking ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400 line-through'}`}>Parking</div>
                                 </>
                               )}
                            </div>

                            <div className="text-xs text-slate-600 grid grid-cols-2 gap-y-1">
                               {resource.type === ResourceType.HOTEL ? (
                                   <>
                                     <div>Twin: <span className="font-semibold text-slate-900">{resource.priceTwin ? `€${resource.priceTwin}` : '-'}</span></div>
                                     <div>SGL: <span className="font-semibold text-slate-900">{resource.priceSingle ? `€${resource.priceSingle}` : '-'}</span></div>
                                     {resource.cancellationDeadline && (
                                         <div className="col-span-2 text-red-500 mt-1 flex items-center gap-1"><AlertIcon /> Deadline: {new Date(resource.cancellationDeadline).toLocaleDateString()}</div>
                                     )}
                                   </>
                               ) : (
                                   <>
                                     <div>Avg: <span className="font-semibold text-slate-900">{resource.avgPrice ? `€${resource.avgPrice}` : '-'}</span></div>
                                     {resource.menuLink && <div className="col-span-2"><a href={resource.menuLink} target="_blank" className="text-blue-500 hover:underline">View Menu</a></div>}
                                   </>
                               )}
                            </div>
                          </div>
                          
                          {/* Inline Chat */}
                          <InlineChat 
                             resource={resource} 
                             currentUser={currentUser} 
                             onAddComment={handleAddComment} 
                             onUpdateComment={handleUpdateComment} 
                          />

                          <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-xl space-y-3">
                             <div className="flex gap-2 text-xs">
                                <button 
                                  onClick={() => currentUser.role === 'OP' ? handleToggleConfirmation(resource, 'OP') : handleReadOnlyClick('OP')}
                                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded border transition-all ${resource.isOpConfirmed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-400'} ${currentUser.role !== 'OP' ? 'opacity-80 cursor-pointer' : 'hover:bg-slate-50 active:scale-95'}`}
                                >
                                   <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${resource.isOpConfirmed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                       {resource.isOpConfirmed && <CheckIcon />}
                                   </div>
                                   OP Verify
                                </button>
                                <button 
                                  onClick={() => currentUser.role === 'SALES' ? handleToggleConfirmation(resource, 'SALES') : handleReadOnlyClick('SALES')}
                                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded border transition-all ${resource.isSalesConfirmed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-400'} ${currentUser.role !== 'SALES' ? 'opacity-80 cursor-pointer' : 'hover:bg-slate-50 active:scale-95'}`}
                                >
                                   <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${resource.isSalesConfirmed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                       {resource.isSalesConfirmed && <CheckIcon />}
                                   </div>
                                   Sales Approve
                                </button>
                             </div>
                             <button onClick={() => { setEditingResource(resource); setIsResourceModalOpen(true); }} className="w-full text-center text-slate-400 hover:text-accent text-xs font-medium">Edit Details</button>
                          </div>
                        </div>
                        );
                      })}

                      <button 
                        onClick={() => { setSelectedDayForNewResource(day.date); setEditingResource(undefined); setIsResourceModalOpen(true); }}
                        className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-accent hover:text-accent hover:bg-blue-50/50 transition-all min-h-[200px]"
                      >
                        <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-white"><PlusIcon /></div>
                        <span className="text-sm font-medium">Add Resource</span>
                        <span className="text-xs opacity-70 mt-1">{day.date}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <TourModal isOpen={isTourModalOpen} onClose={() => setIsTourModalOpen(false)} onSave={editingTour ? handleUpdateTour : handleCreateTour} tour={editingTour} onDelete={handleDeleteTour} />
      <ResourceModal 
        isOpen={isResourceModalOpen} 
        onClose={() => { setIsResourceModalOpen(false); setEditingResource(undefined); }} 
        onSave={handleSaveResource} 
        resource={editingResource} 
        tour={activeTour!} 
        days={tourDays} 
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmationModal && <ConfirmationModal isOpen={confirmationModal.isOpen} title={confirmationModal.title} message={confirmationModal.message} onConfirm={confirmationModal.onConfirm} onCancel={() => setConfirmationModal(null)} />}
    </div>
  );
}
