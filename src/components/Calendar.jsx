import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import EventModal from './EventModal';

const Event = ({ event, dateKey, onDelete, onClick }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('일정을 삭제 하시겠습니까?')) {
      onDelete(dateKey, event.id);
    }
  };

  return (
    <div
      className="text-xs p-2 bg-naver-pastel-blue/20 rounded group relative hover:bg-naver-pastel-blue/30 cursor-pointer"
      onClick={() => onClick(event)}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{event.title}</span>
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 px-2"
          >
            ×
          </button>
        </div>
        <span className="text-[10px] text-gray-500">
          {event.startTime} - {event.endTime}
        </span>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getDateKey = (date) => format(date, 'yyyyMMdd');

  const handleAddEvent = (eventData) => {
    const newEventObj = {
      id: uuidv4(),
      ...eventData
    };

    setEvents(prev => ({
      ...prev,
      [eventData.date]: [...(prev[eventData.date] || []), newEventObj]
    }));
  };

  const handleDeleteEvent = (dateKey, eventId) => {
    setEvents(prev => {
      if (!prev[dateKey]) return prev;
      
      const updatedEvents = prev[dateKey].filter(event => event.id !== eventId);
      
      const newState = { ...prev };
      
      if (updatedEvents.length === 0) {
        delete newState[dateKey];
      } else {
        newState[dateKey] = updatedEvents;
      }
      
      return newState;
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] p-6">
      <div className="bg-white rounded-lg shadow-lg h-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b bg-naver-pastel-gray">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrevMonth}
              className="p-3 text-lg hover:bg-naver-pastel-blue/20 rounded text-naver-pastel-navy"
            >
              &lt;
            </button>
            <h2 className="text-2xl font-bold text-naver-pastel-navy">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h2>
            <button 
              onClick={handleNextMonth}
              className="p-3 text-lg hover:bg-naver-pastel-blue/20 rounded text-naver-pastel-navy"
            >
              &gt;
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setSelectedDate(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-naver-pastel-navy text-white rounded hover:bg-naver-pastel-navy/80"
          >
            일정 추가
          </button>
        </div>

        {/* 요일 */}
        <div className="grid grid-cols-7 gap-2 p-6 bg-naver-pastel-gray/30">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div 
              key={day}
              className={`
                text-center font-medium p-3 text-lg
                ${index === 0 ? 'text-red-400' : ''}
                ${index === 6 ? 'text-blue-400' : ''}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-2 p-6 flex-1">
          {days.map((day, index) => {
            const dateKey = getDateKey(day);
            const dayEvents = events[dateKey] || [];
            
            return (
              <div
                key={dateKey}
                className={`
                  min-h-[120px] p-3 border border-gray-100 rounded
                  ${format(day, 'MM') !== format(currentDate, 'MM') ? 'bg-gray-50' : 'bg-white'}
                  ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-naver-pastel-navy/10' : ''}
                `}
              >
                <div className={`
                  text-right mb-2 text-lg font-medium
                  ${index % 7 === 0 ? 'text-red-400' : ''}
                  ${index % 7 === 6 ? 'text-blue-400' : ''}
                `}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <Event
                      key={event.id}
                      event={event}
                      dateKey={dateKey}
                      onDelete={handleDeleteEvent}
                      onClick={handleEventClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        onSave={handleAddEvent}
        selectedEvent={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar; 