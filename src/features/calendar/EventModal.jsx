import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const EventModal = ({ isOpen, onClose, onSave, selectedEvent, selectedDate }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    content: ''
  });

  useEffect(() => {
    if (selectedEvent) {
      setEventData({
        title: selectedEvent.title,
        date: selectedEvent.date,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
        content: selectedEvent.content || ''
      });
    } else if (selectedDate) {
      setEventData({
        ...eventData,
        date: selectedDate
      });
    } else {
      setEventData({
        title: '',
        date: format(new Date(), 'yyyyMMdd'),
        startTime: '',
        endTime: '',
        content: ''
      });
    }
  }, [selectedEvent, selectedDate, isOpen]);

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
      alert('시작 시간이 종료 시간보다 빨라야 합니다.');
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
            <h2 className="text-xl font-bold text-color-pastel-navy">
              {selectedEvent ? 'edit schedule' : 'new schedule'}
            </h2>
            {eventData.date && (
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(eventData.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')), 'yyyy년 MM월 dd일')}
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
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
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
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
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy h-24"
              required
              readOnly={selectedEvent}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-color-pastel-navy text-white py-2 rounded hover:bg-color-pastel-navy/80"
          >
            {selectedEvent ? 'EDIT' : 'SAVE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 