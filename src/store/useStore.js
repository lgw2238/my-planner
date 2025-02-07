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
      setEvents: (newEvents) => set({ events: newEvents }),

      // sidebar state management
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // evaluation items management
      evaluationItems: [],
      addEvaluationItem: (item) => set((state) => ({
        evaluationItems: [...state.evaluationItems, item]
      })),
      updateEvaluationItem: (updatedItem) => set((state) => ({
        evaluationItems: state.evaluationItems.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        )
      })),
      deleteEvaluationItem: (itemId) => set((state) => ({
        evaluationItems: state.evaluationItems.filter(item => item.id !== itemId)
      })),
      // authentication status set up method
      isLoggedIn: false,
      token: '',
      user: null,
      setIsLoggedIn: (value, userData) => set({ isLoggedIn: value, user: userData }),
      setToken: (token) => set({ token }),
      logout: () => set({ isLoggedIn: false, token: '', user: null }),
    }),
    {
      name: 'local-planner-storage',
    }
  )
);

export default useStore; 