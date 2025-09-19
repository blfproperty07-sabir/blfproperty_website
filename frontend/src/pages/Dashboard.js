import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SubmitProperty from '../components/SubmitProperty';
import propertyService from '../services/propertyService';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && activeTab === 'properties') {
      fetchUserProperties();
    }
  }, [user, activeTab]);

  const fetchUserProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getUserProperties();
      setUserProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching user properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Please login to access your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      sold: 'bg-gray-100 text-gray-800',
      rented: 'bg-blue-100 text-blue-800'
    };
    
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'submit'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submit Property
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'properties'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Properties
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-home text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{userProperties.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userProperties.filter(p => p.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-clock text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userProperties.filter(p => p.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('submit')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-plus text-white"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Submit New Property</h3>
                    <p className="text-sm text-gray-600">List your property for sale or rent</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('properties')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-list text-white"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">View My Properties</h3>
                    <p className="text-sm text-gray-600">Manage your listed properties</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Property Tab */}
        {activeTab === 'submit' && (
          <SubmitProperty />
        )}

        {/* My Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
              <button
                onClick={() => setActiveTab('submit')}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                Add New Property
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your properties...</p>
              </div>
            ) : userProperties.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {userProperties.map((property) => (
                  <div key={property._id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-48 h-48">
                        <img
                          src={property.images?.[0]?.url || property.images?.[0] || '/image/2bhk-modern-apartment.jpg'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(property.status)}`}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{property.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Type:</span> {property.type}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span> {property.category}
                          </div>
                          <div>
                            <span className="font-medium">Bedrooms:</span> {property.features?.bedrooms || 0}
                          </div>
                          <div>
                            <span className="font-medium">Area:</span> {property.area?.size} {property.area?.unit}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-orange-600">
                              {formatCurrency(property.price?.amount || property.price)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Listed {formatDate(property.createdAt)}
                            </p>
                          </div>
                          
                          <div className="flex space-x-3">
                            {property.status === 'approved' && (
                              <a
                                href={`/properties/${property._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Live
                              </a>
                            )}
                            <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                              Edit
                            </button>
                          </div>
                        </div>
                        
                        {property.status === 'rejected' && property.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-700">
                              <strong>Rejection Reason:</strong> {property.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <i className="fas fa-home text-6xl text-gray-300"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Properties Yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't submitted any properties yet. Start by adding your first property!
                </p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Submit Your First Property
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;