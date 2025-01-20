import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // 캘린더 이벤트 관련 상태와 액션
      events: {},
      addEvent: (newEvent) => set((state) => {
        const dateKey = newEvent.date;
        return {
          events: {
            ...state.events,
            [dateKey]: [...(state.events[dateKey] || []), newEvent]
          }
        };
      }),
      updateEvent: (updatedEvent) => set((state) => {
        const dateKey = updatedEvent.date;
        return {
          events: {
            ...state.events,
            [dateKey]: state.events[dateKey].map(event =>
              event.id === updatedEvent.id ? updatedEvent : event
            )
          }
        };
      }),
      deleteEvent: (dateKey, eventId) => set((state) => {
        const updatedEvents = { ...state.events };
        if (updatedEvents[dateKey]) {
          updatedEvents[dateKey] = updatedEvents[dateKey].filter(
            event => event.id !== eventId
          );
          if (updatedEvents[dateKey].length === 0) {
            delete updatedEvents[dateKey];
          }
        }
        return { events: updatedEvents };
      }),

      // 인증 관련 상태와 액션
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),

      // 사이드바 상태 관리
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
    }),
    {
      name: 'planner-storage',
    }
  )
);

export default useStore; 