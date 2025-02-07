import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, 
  startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, subDays, isSameDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import EventModal from './EventModal';
import useStore from '../../store/useStore';
import { holidays } from '../../utils/holidays';
import axiosInstance from '../../api/axios'; 

const Event = ({ event, dateKey, onDelete, onClick, setIsModalOpen }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(dateKey, event.id);
    }
  };

  return (
    <div
      className="text-xs p-2 bg-color-pastel-blue/20 rounded group relative hover:bg-color-pastel-blue/30 cursor-pointer"
      onClick={() => {
        onClick(event);
        setIsModalOpen(true);
      }}
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

// hour to minutes
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const Calendar = () => {
  const { events, addEvent, updateEvent, deleteEvent, setEvents } = useStore();
  const token  = useStore.getState().token.data;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // 'month', 'week', 'day'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  console.log('calendar/list env:', process.env.REACT_APP_ENV);
  console.log('calendar/list token:', token);

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'dev') {
      axiosInstance.post('/api/calendar/list', null, {
        headers: {
          Authorization: `Bearer ${useStore.getState().token.data}`,
        },
        withCredentials: true 
      })
        .then(response => {
          if (response.status === 200) {
            const storedEvents = response.data;
            setEvents(storedEvents);
          }
        })
        .catch(error => {
          if (error instanceof SyntaxError) {
            console.log('Error fetching events:', error.message);
          } else {
            console.log('Error fetching events:', error);
          }
        });
    } else {
      const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
      setEvents(storedEvents);
    }
  }, []);

  // date handler
  const handlePrev = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      default:
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  // day length calculation
  const getDaysToShow = () => {
    switch (viewType) {
      case 'month': {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart);
        const calendarEnd = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
      }
      case 'week': {
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      }
      case 'day':
        return [currentDate];
    }
  };

  // timeLine setUp (weekly/daily view change)
  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  // event rendering 
  const renderEvents = (day, viewType = 'month') => {
    const dateKey = format(day, 'yyyyMMdd');
    const dayEvents = events[dateKey] || [];

    if (viewType === 'month') {
      return dayEvents.map((event) => (
        <Event
          key={event.id}
          event={event}
          dateKey={dateKey}
          onDelete={deleteEvent}
          onClick={setSelectedEvent}
          setIsModalOpen={setIsModalOpen}
        />
      ));
    }

    // weekly/daily view rendering
    return dayEvents.map((event) => {
      const startMinutes = timeToMinutes(event.startTime);
      const endMinutes = timeToMinutes(event.endTime);
      const duration = endMinutes - startMinutes;
      const top = (startMinutes / 60) * 5; // 5rem(80px)이 1시간
      const height = (duration / 60) * 5;

      return (
        <div
          key={event.id}
          className={`
            absolute left-0 right-0 mx-2 rounded px-2 
            bg-color-pastel-blue/20 hover:bg-color-pastel-blue/30 
            cursor-pointer group border border-color-pastel-blue/30
            ${height < 2.5 ? 'py-0.5' : 'py-1'}
          `}
          style={{
            top: `${top}rem`,
            height: `${height}rem`,
            zIndex: 10,
          }}
          onClick={() => {
            setSelectedEvent(event || null);;
            setIsModalOpen(true);
          }}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* title and delete button */}
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm truncate flex-1">
                {event.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('really delete this event?')) {
                    deleteEvent(dateKey, event.id);
                  }
                }}
                className="text-red-400 opacity-0 group-hover:opacity-100 text-sm px-1"
              >
                ×
              </button>
            </div>

            {/* time display */}
            <div className="text-xs text-gray-500 mt-0.5">
              {event.startTime} - {event.endTime}
            </div>

            {/* content display (when height is enough) */}
            {height > 3 && event.content && (
              <div className="text-xs text-gray-600 mt-1 line-clamp-2 flex-1">
                {event.content}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  // monthly view rendering
  const renderMonthView = () => {
    const days = getDaysToShow();
    
    return (
      <div className="grid grid-cols-7 gap-2 flex-1">
        {days.map((day) => {
          const dateKey = format(day, 'yyyyMMdd');
          const holiday = holidays[dateKey];
          return (
            <div
              key={dateKey}
              className={`
                min-h-[120px] p-3 border border-gray-100 rounded
                ${format(day, 'MM') !== format(currentDate, 'MM') 
                  ? 'bg-gray-100/50 text-gray-400' 
                  : 'bg-white'
                }
                ${isSameDay(day, new Date()) ? 'bg-color-pastel-navy/10' : ''}
                `}
            >
              <div className={`
                text-right mb-2 text-lg font-medium
                ${format(day, 'MM') !== format(currentDate, 'MM')
                  ? 'text-gray-400'
                  : `${format(day, 'E') === 'Sun' || holiday ? 'text-red-400' : ''}
                     ${format(day, 'E') === 'Sat' ? 'text-blue-400' : ''}`
                }
              `}>
                {format(day, 'd')}
                {holiday && (
                  <div className="text-xs text-red-400 text-left mt-1">
                    {holiday.name}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {renderEvents(day)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // weekly/daily view rendering
  const renderTimelineView = () => {
    const days = getDaysToShow();
    
    return (
      <div className="flex flex-1 overflow-auto">
        {/* time column */}
        <div className="w-20 flex-shrink-0 border-r">
          <div className="h-[68px] border-b" />
          {timeSlots.map((time) => (
            <div key={time} className="h-20 border-b px-2 py-1 text-sm text-gray-500">
              {time}
            </div>
          ))}
        </div>
        
        {/* day column */}
        <div className={`flex flex-1 ${viewType === 'day' ? '' : 'divide-x'}`}>
          {days.map((day) => {
            const dateKey = format(day, 'yyyyMMdd');
            const holiday = holidays[dateKey];
            return (
              <div key={dateKey} className="flex-1">
                <div className={`
                  sticky top-0 p-2 text-center border-b bg-white z-20 h-[68px] flex flex-col justify-center
                  ${format(day, 'E') === 'Sun' || holiday ? 'text-red-400' : ''}
                  ${format(day, 'E') === 'Sat' ? 'text-blue-400' : ''}
                `}>
                  <div className="font-medium">{format(day, 'E')}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                  {holiday && (
                    <div className="text-xs text-red-400">
                      {holiday.name}
                    </div>
                  )}
                </div>
                <div className="relative">
                  {timeSlots.map((time) => (
                    <div key={time} className="h-20 border-b relative">
                      <div className="absolute left-0 right-0 -top-[1px] h-[1px] bg-gray-300" />
                    </div>
                  ))}
                  {/* render events */}
                  {renderEvents(day, viewType)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // event save handler
  const handleSaveEvent = (eventData) => {
    if (selectedEvent) {
      // update event
      updateEvent({
        ...eventData,
        id: selectedEvent.id
      });
    } else {
      // add new event
      addEvent({
        ...eventData,
        id: uuidv4()
      });
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] p-6">
      <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between p-6 border-b bg-color-pastel-gray">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="p-3 text-lg hover:bg-color-pastel-blue/20 rounded text-color-pastel-navy"
            >
              &lt;
            </button>
            <h2 className="text-2xl font-bold text-color-pastel-navy">
              {format(currentDate, viewType === 'month' ? 'MMMM yyyy' : 'yyyy.MM.dd')}
            </h2>
            <button 
              onClick={handleNext}
              className="p-3 text-lg hover:bg-color-pastel-blue/20 rounded text-color-pastel-navy"
            >
              &gt;
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* view change button */}
            <div className="flex rounded-lg overflow-hidden border border-color-pastel-navy">
              {['month', 'week', 'day'].map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`
                    px-4 py-2 text-sm font-medium
                    ${viewType === type 
                      ? 'bg-color-pastel-navy text-white' 
                      : 'text-color-pastel-navy hover:bg-color-pastel-blue/20'
                    }
                  `}
                >
                  {type === 'month' ? 'Month' : type === 'week' ? 'Week' : 'Day'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedEvent(null);
                setSelectedDate(format(currentDate, 'yyyyMMdd'));
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-color-pastel-navy text-white rounded hover:bg-color-pastel-navy/80"
            >
              add schedule
            </button>
          </div>
        </div>

        {/* day header (monthly view only) */}
        {viewType === 'month' && (
          <div className="grid grid-cols-7 gap-2 p-6 bg-color-pastel-gray/30">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
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
        )}

        {/* calendar body */}
        <div className="flex-1 overflow-auto">
          {viewType === 'month' ? renderMonthView() : renderTimelineView()}
        </div>
      </div>

        {/* event modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        onSave={handleSaveEvent}
        selectedEvent={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar; 