import React, { createContext, useContext, useReducer } from 'react';

// Property Context
const PropertyContext = createContext();

// Initial state
const initialState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,
  filters: {
    type: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    furnished: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  }
};

// Action types
const PROPERTY_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PROPERTIES: 'SET_PROPERTIES',
  SET_CURRENT_PROPERTY: 'SET_CURRENT_PROPERTY',
  ADD_PROPERTY: 'ADD_PROPERTY',
  UPDATE_PROPERTY: 'UPDATE_PROPERTY',
  DELETE_PROPERTY: 'DELETE_PROPERTY',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  CLEAR_CURRENT_PROPERTY: 'CLEAR_CURRENT_PROPERTY'
};

// Reducer function
const propertyReducer = (state, action) => {
  switch (action.type) {
    case PROPERTY_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case PROPERTY_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case PROPERTY_ACTIONS.SET_PROPERTIES:
      return {
        ...state,
        properties: action.payload,
        loading: false,
        error: null
      };

    case PROPERTY_ACTIONS.SET_CURRENT_PROPERTY:
      return {
        ...state,
        currentProperty: action.payload,
        loading: false,
        error: null
      };

    case PROPERTY_ACTIONS.ADD_PROPERTY:
      return {
        ...state,
        properties: [action.payload, ...state.properties]
      };

    case PROPERTY_ACTIONS.UPDATE_PROPERTY:
      return {
        ...state,
        properties: state.properties.map(property => 
          property._id === action.payload._id ? action.payload : property
        ),
        currentProperty: state.currentProperty?._id === action.payload._id 
          ? action.payload 
          : state.currentProperty
      };

    case PROPERTY_ACTIONS.DELETE_PROPERTY:
      return {
        ...state,
        properties: state.properties.filter(property => property._id !== action.payload),
        currentProperty: state.currentProperty?._id === action.payload 
          ? null 
          : state.currentProperty
      };

    case PROPERTY_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case PROPERTY_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };

    case PROPERTY_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      };

    case PROPERTY_ACTIONS.CLEAR_CURRENT_PROPERTY:
      return {
        ...state,
        currentProperty: null
      };

    default:
      return state;
  }
};

// Property Provider Component
export const PropertyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: PROPERTY_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: PROPERTY_ACTIONS.SET_ERROR, payload: error });
  };

  const setProperties = (properties) => {
    dispatch({ type: PROPERTY_ACTIONS.SET_PROPERTIES, payload: properties });
  };

  const setCurrentProperty = (property) => {
    dispatch({ type: PROPERTY_ACTIONS.SET_CURRENT_PROPERTY, payload: property });
  };

  const addProperty = (property) => {
    dispatch({ type: PROPERTY_ACTIONS.ADD_PROPERTY, payload: property });
  };

  const updateProperty = (property) => {
    dispatch({ type: PROPERTY_ACTIONS.UPDATE_PROPERTY, payload: property });
  };

  const deleteProperty = (propertyId) => {
    dispatch({ type: PROPERTY_ACTIONS.DELETE_PROPERTY, payload: propertyId });
  };

  const setFilters = (filters) => {
    dispatch({ type: PROPERTY_ACTIONS.SET_FILTERS, payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: PROPERTY_ACTIONS.CLEAR_FILTERS });
  };

  const setPagination = (pagination) => {
    dispatch({ type: PROPERTY_ACTIONS.SET_PAGINATION, payload: pagination });
  };

  const clearCurrentProperty = () => {
    dispatch({ type: PROPERTY_ACTIONS.CLEAR_CURRENT_PROPERTY });
  };

  const value = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    setProperties,
    setCurrentProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    setFilters,
    clearFilters,
    setPagination,
    clearCurrentProperty
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

// Custom hook to use property context
export const useProperty = () => {
  const context = useContext(PropertyContext);
  
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  
  return context;
};

export default PropertyContext;