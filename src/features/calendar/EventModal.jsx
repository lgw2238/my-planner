import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const EventModal = ({ isOpen, onClose, onSave, selectedEvent, selectedDate }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    content: ''
  });

  useEffect(() => {
    setEventData({
      title: selectedEvent?.title || '',
      date: selectedEvent?.date || selectedDate || '',
      startTime: selectedEvent?.startTime || '',
      endTime: selectedEvent?.endTime || '',
      content: selectedEvent?.content || ''
    });
  }, [selectedEvent, selectedDate]);

  const validateTimes = () => {
    if (!eventData.startTime || !eventData.endTime) return true;
    
    const [startHour, startMinute] = eventData.startTime.split(':').map(Number);
    const [endHour, endMinute] = eventData.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return startMinutes < endMinutes;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateTimes()) {
      alert('Start time must be earlier than end time.');
      return;
    }
    
    onSave(eventData);
    onClose();
  };

  const formatDateForInput = (dateStr) => {
    return dateStr ? `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}` : '';
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value.replace(/-/g, '');
    setEventData({ ...eventData, date: newDate });
  };

  const handleTimeChange = (type, value) => {
    setEventData(prev => {
      const newData = { ...prev, [type]: value };
      return newData;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-naver-pastel-navy">
              {selectedEvent ? 'Event Details' : 'Add New Event'}
            </h2>
            {eventData.date && (
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(eventData.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')), 'MMMM d, yyyy')}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-naver-pastel-navy"
              required
              readOnly={selectedEvent}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formatDateForInput(eventData.date)}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-naver-pastel-navy"
              required
              readOnly={selectedEvent}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={eventData.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-naver-pastel-navy"
                required
                readOnly={selectedEvent}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={eventData.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-naver-pastel-navy"
                required
                readOnly={selectedEvent}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={eventData.content}
              onChange={(e) => setEventData({ ...eventData, content: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-naver-pastel-navy h-24"
              required
              readOnly={selectedEvent}
            />
          </div>
          {!selectedEvent && (
            <button
              type="submit"
              className="w-full bg-naver-pastel-navy text-white py-2 rounded hover:bg-naver-pastel-navy/80"
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventModal; 