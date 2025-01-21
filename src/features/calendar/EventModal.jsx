import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const EventModal = ({ isOpen, onClose, onSave, selectedEvent, selectedDate }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    content: '',
    isAllDay: false
  });

  useEffect(() => {
    if (selectedEvent) {
      setEventData({
        title: selectedEvent.title,
        date: selectedEvent.date,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
        content: selectedEvent.content || '',
        isAllDay: selectedEvent.isAllDay || false
      });
    } else if (selectedDate) {
      setEventData({
        ...eventData,
        date: selectedDate,
        isAllDay: false,
        startTime: '',
        endTime: ''
      });
    } else {
      setEventData({
        title: '',
        date: format(new Date(), 'yyyyMMdd'),
        startTime: '',
        endTime: '',
        content: '',
        isAllDay: false
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
      alert('start time must be earlier than end time.');
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

  const handleAllDayChange = (e) => {
    const isChecked = e.target.checked;
    setEventData(prev => ({
      ...prev,
      isAllDay: isChecked,
      startTime: isChecked ? '00:00' : '',
      endTime: isChecked ? '23:59' : ''
    }));
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
                {format(new Date(eventData.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')), 'yyyy.MM.dd')}
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
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allDay"
              checked={eventData.isAllDay}
              onChange={handleAllDayChange}
              className="w-4 h-4 text-color-pastel-navy rounded border-gray-300 focus:ring-color-pastel-navy"
            />
            <label htmlFor="allDay" className="ml-2 block text-gray-700">
              All day
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={eventData.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy disabled:bg-gray-100"
                required
                disabled={eventData.isAllDay}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={eventData.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy disabled:bg-gray-100"
                required
                disabled={eventData.isAllDay}
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
            />
          </div>
          <div className="flex gap-2">
            {selectedEvent && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                CANCEL
              </button>
            )}
            <button
              type="submit"
              className={`${selectedEvent ? 'flex-1' : 'w-full'} bg-color-pastel-navy text-white py-2 rounded hover:bg-color-pastel-navy/80`}
            >
              {selectedEvent ? 'EDIT' : 'SAVE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 