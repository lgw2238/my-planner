import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // calendar event related state and action
      events: {},
      addEvent: (event) => set((state) => {
        const dateKey = event.date;
        const existingEvents = state.events[dateKey] || [];
        return {
          events: {
            ...state.events,
            [dateKey]: [...existingEvents, event]
          }
        };
      }),
      updateEvent: (updatedEvent) => set((state) => {
        const dateKey = updatedEvent.date;
        const existingEvents = state.events[dateKey] || [];
        return {
          events: {
            ...state.events,
            [dateKey]: existingEvents.map(event =>
              event.id === updatedEvent.id ? updatedEvent : event
            )
          }
        };
      }),
      deleteEvent: (dateKey, eventId) => set((state) => {
        const existingEvents = state.events[dateKey] || [];
        return {
          events: {
            ...state.events,
            [dateKey]: existingEvents.filter(event => event.id !== eventId)
          }
        };
      }),

      // authentication related state and action
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),

      // sidebar state management
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'planner-storage',
    }
  )
);

export default useStore; 