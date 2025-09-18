import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import adminService from '../services/adminService';
import teamService from '../services/teamService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    totalUsers: 0,
    totalTeamMembers: 0
  });
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [rentalProperties, setRentalProperties] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [propertiesSubTab, setPropertiesSubTab] = useState('pending'); // 'pending' or 'all'
  const [rentalsSubTab, setRentalsSubTab] = useState('all'); // 'all', 'pending', 'approved'
  const [loading, setLoading] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddRentalModal, setShowAddRentalModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    if (showAddTeamModal) {
      // Scroll modal to top when opened
      setTimeout(() => {
        const modal = document.querySelector('.team-modal-content');
        if (modal) {
          modal.scrollTop = 0;
        }
      }, 100);
    }
  }, [showAddTeamModal]);

  useEffect(() => {
    // Refetch pending properties when Properties tab is selected
    if (user?.role === 'admin' && activeTab === 'properties') {
      fetchPendingProperties();
      fetchAllProperties(); // Also fetch all properties
    }
  }, [activeTab, user]);

  useEffect(() => {
    // Refetch rental properties when Rentals tab is selected
    if (user?.role === 'admin' && activeTab === 'rentals') {
      fetchRentalProperties();
    }
  }, [activeTab, user]);

  const fetchPendingProperties = async () => {
    try {
      console.log('Fetching pending properties...');
      const response = await adminService.getAllProperties({ status: 'pending' });
      console.log('Pending properties response:', response);
      
      const properties = response.data?.properties || [];
      console.log('Setting pending properties:', properties);
      
      setPendingProperties(properties);
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      setPendingProperties([]);
    }
  };

  const fetchAllProperties = async () => {
    try {
      console.log('Fetching all properties...');
      const response = await adminService.getAllProperties(); // No status filter to get all
      console.log('All properties response:', response);
      
      const properties = response.data?.properties || [];
      console.log('Setting all properties:', properties);
      
      setAllProperties(properties);
    } catch (error) {
      console.error('Error fetching all properties:', error);
      setAllProperties([]);
    }
  };

  const fetchRentalProperties = async () => {
    try {
      console.log('Fetching rental properties...');
      const response = await adminService.getAllProperties({ category: 'rent' });
      console.log('Rental properties response:', response);
      
      const properties = response.data?.properties || [];
      console.log('Setting rental properties:', properties);
      
      setRentalProperties(properties);
    } catch (error) {
      console.error('Error fetching rental properties:', error);
      setRentalProperties([]);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats, pending properties, and team members
      const [dashboardRes, pendingRes, teamRes] = await Promise.all([
        adminService.getDashboardData().catch(() => ({ data: { overview: {} } })),
        adminService.getAllProperties({ status: 'pending' }).catch(() => ({ data: { properties: [] } })),
        teamService.getAllTeamMembers({ showAll: 'true' }).catch(() => ({ data: { teamMembers: [], boss: null } }))
      ]);
      
      console.log('Dashboard responses:', { dashboardRes, pendingRes, teamRes });
      console.log('Pending properties response:', pendingRes);
      console.log('Pending properties data:', pendingRes.data);
      
      // Set stats
      const overview = dashboardRes.data?.overview || {};
      setStats({
        totalProperties: overview.properties?.total || 0,
        pendingProperties: overview.properties?.pending || 0,
        approvedProperties: overview.properties?.approved || 0,
        totalUsers: overview.users?.total || 0,
        totalTeamMembers: overview.team?.total || 0
      });
      
      // Set data - Access properties and teamMembers arrays correctly
      const properties = pendingRes.data?.properties || [];
      const boss = teamRes.data?.boss;
      const members = teamRes.data?.teamMembers || [];
      
      // Combine boss and team members for admin dashboard
      const allTeamMembers = boss ? [boss, ...members] : members;
      
      console.log('Setting pending properties:', properties);
      console.log('Setting team members:', allTeamMembers);
      
      setPendingProperties(properties);
      setTeamMembers(allTeamMembers);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      // Set default values in case of error
      setPendingProperties([]);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyApproval = async (propertyId, action) => {
    try {
      if (action === 'approve') {
        await adminService.approveProperty(propertyId);
        toast.success('Property approved successfully');
      } else {
        await adminService.rejectProperty(propertyId, 'Property does not meet our standards');
        toast.success('Property rejected');
      }
      
      // Update local state
      setPendingProperties(prev => prev.filter(p => p._id !== propertyId));
      setStats(prev => ({ 
        ...prev, 
        pendingProperties: prev.pendingProperties - 1,
        approvedProperties: action === 'approve' ? prev.approvedProperties + 1 : prev.approvedProperties
      }));
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await adminService.deleteProperty(propertyId);
      toast.success('Property deleted successfully');
      setPendingProperties(prev => prev.filter(p => p._id !== propertyId));
      setAllProperties(prev => prev.filter(p => p._id !== propertyId));
      setStats(prev => ({ ...prev, pendingProperties: prev.pendingProperties - 1 }));
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleDeleteSoldProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This is typically done after a property is sold. This action cannot be undone.')) return;
    
    try {
      await adminService.deleteProperty(propertyId);
      toast.success('Property deleted successfully (marked as sold)');
      setPendingProperties(prev => prev.filter(p => p._id !== propertyId));
      setAllProperties(prev => prev.filter(p => p._id !== propertyId));
      // Refresh stats to get accurate counts
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleDeleteTeamMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      await teamService.deleteTeamMember(memberId);
      toast.success('Team member removed successfully');
      setTeamMembers(prev => prev.filter(m => m._id !== memberId));
      setStats(prev => ({ ...prev, totalTeamMembers: prev.totalTeamMembers - 1 }));
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      // Extract form data
      const formData = new FormData(e.target);
      
      // Basic validation of required fields
      const requiredFields = ['name', 'position', 'department', 'email', 'phone', 'password', 'userRole'];
      const missingFields = [];
      
      for (const field of requiredFields) {
        if (!formData.get(field) || formData.get(field).toString().trim() === '') {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Add additional fields that might not be in form
      formData.append('joiningDate', new Date().toISOString());
      
      // Check if file is attached
      const fileInput = e.target.querySelector('input[name="profileImage"]');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        console.log('Profile image file selected:', fileInput.files[0].name, 'Size:', fileInput.files[0].size);
      } else {
        console.log('No profile image file selected');
      }
      
      console.log('Form data being sent:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(key, value);
        }
      }
      
      const response = await teamService.createTeamMember(formData);
      console.log('Team member creation response:', response);
      toast.success('Team member added successfully');
      setTeamMembers(prev => [...prev, response.data.teamMember]);
      setStats(prev => ({ ...prev, totalTeamMembers: prev.totalTeamMembers + 1 }));
      setShowAddTeamModal(false);
      
      // Reset form
      e.target.reset();
    } catch (error) {
      console.error('Error adding team member:', error.response?.data || error);
      
      // Show specific validation errors if available
      if (error.response?.data?.error === 'DUPLICATE_EMAIL' || error.response?.data?.error === 'DUPLICATE_TEAM_EMAIL') {
        toast.error(error.response.data.message || 'Email already exists. Please use a different email.');
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add team member. Please check all required fields.');
      }
    }
  };

  const handleAddRentalProperty = async (e) => {
    e.preventDefault();
    try {
      // Extract form data
      const formData = new FormData(e.target);
      
      // Add fixed fields for rental properties
      formData.append('category', 'rent');
      formData.append('status', 'approved'); // Auto-approve admin-created properties
      formData.append('createdBy', 'admin');
      
      // Basic validation of required fields
      const requiredFields = ['title', 'type', 'rent', 'area', 'address', 'city', 'state', 'pincode', 'description'];
      const missingFields = [];
      
      console.log('=== FRONTEND VALIDATION ===');
      for (const field of requiredFields) {
        const value = formData.get(field);
        console.log(`${field}:`, value);
        if (!value || value.toString().trim() === '') {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Convert numeric fields
      const rent = parseFloat(formData.get('rent'));
      const area = parseFloat(formData.get('area'));
      if (isNaN(rent) || isNaN(area) || rent <= 0 || area <= 0) {
        toast.error('Please enter valid rent and area values');
        return;
      }
      
      // Set default values for optional fields
      if (!formData.get('bedrooms') || formData.get('bedrooms') === '') formData.set('bedrooms', '1');
      if (!formData.get('bathrooms') || formData.get('bathrooms') === '') formData.set('bathrooms', '1');
      if (!formData.get('floor') || formData.get('floor') === '') formData.set('floor', '1');
      if (!formData.get('furnished') || formData.get('furnished') === '') formData.set('furnished', 'unfurnished');
      if (!formData.get('deposit') || formData.get('deposit') === '') formData.set('deposit', '0');
      
      console.log('Creating rental property with data:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(key, value);
        }
      }
      
      const response = await adminService.createRentalProperty(formData);
      console.log('Rental property creation response:', response);
      toast.success('Rental property added successfully');
      
      // Update the rental properties list
      setRentalProperties(prev => [...prev, response.data.property]);
      
      // Reset form and close modal
      e.target.reset();
      setShowAddRentalModal(false);
    } catch (error) {
      console.error('Error adding rental property:', error);
      
      // Show specific validation errors if available
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add rental property. Please check all required fields.');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen py-8">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-red-600">Access Denied</h1>
            <p className="text-gray-600 mb-4">Admin access required</p>
          </div>
        </div>
      </div>
    );
  }

  const tabMenu = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'properties', label: 'Properties', icon: '🏠' },
    { id: 'rentals', label: 'Rental Properties', icon: '🏘️' },
    { id: 'team', label: 'Team Management', icon: '👥' },
    { id: 'contacts', label: 'Contact Inquiries', icon: '📧' },
    { id: 'users', label: 'User Management', icon: '👤' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your platform and team</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 text-primary-600 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">Welcome, {user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="container-custom">
          <div className="flex space-x-8 overflow-x-auto">
            {tabMenu.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pendingProperties}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalTeamMembers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h3>
                <div className="space-y-4">
                  {Array.isArray(pendingProperties) && pendingProperties.slice(0, 5).map((property, index) => (
                    <div key={property._id || index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🏠</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{property.title || `Property ${index + 1}`}</p>
                        <p className="text-sm text-gray-600">{property.location?.city || 'Mumbai'}</p>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    </div>
                  ))}
                  {(!Array.isArray(pendingProperties) || pendingProperties.length === 0) && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🏠</div>
                      <p className="text-gray-600">No pending properties</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Overview</h3>
                <div className="space-y-4">
                  {Array.isArray(teamMembers) && teamMembers.slice(0, 5).map((member, index) => (
                    <div key={member._id || index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name || `Team Member ${index + 1}`}</p>
                        <p className="text-sm text-gray-600">{member.position || 'Property Consultant'}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                  {(!Array.isArray(teamMembers) || teamMembers.length === 0) && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">👥</div>
                      <p className="text-gray-600">No team members found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Sub-tabs for Properties */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Management</h3>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setPropertiesSubTab('pending')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      propertiesSubTab === 'pending'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Pending Properties ({stats.pendingProperties})
                  </button>
                  <button
                    onClick={() => setPropertiesSubTab('all')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      propertiesSubTab === 'all'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Properties ({stats.totalProperties})
                  </button>
                </div>
              </div>

              {/* Pending Properties Tab */}
              {propertiesSubTab === 'pending' && (
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600">Review and approve property listings from sellers</p>
                  </div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-gray-600 mt-4">Loading properties...</p>
                    </div>
                  ) : (!Array.isArray(pendingProperties) || pendingProperties.length === 0) ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">✅</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                      <p className="text-gray-600">No pending properties to review</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Array.isArray(pendingProperties) && pendingProperties.map((property) => (
                        <div key={property._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{property.title}</h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Pending Review
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-500">Location</p>
                                  <p className="font-medium">{property.location?.city}, {property.location?.state}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Price</p>
                                  <p className="font-medium">₹{property.price?.amount?.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Type</p>
                                  <p className="font-medium capitalize">{property.type}</p>
                                </div>
                              </div>
                              <div className="mb-4">
                                <p className="text-sm text-gray-500">Owner Details</p>
                                <p className="font-medium">{property.owner?.name} • {property.owner?.email}</p>
                                <p className="text-sm text-gray-600">📞 {property.owner?.phone}</p>
                              </div>
                              <p className="text-gray-600 text-sm">{property.description}</p>
                            </div>
                            <div className="flex flex-col space-y-2 ml-6">
                              <button
                                onClick={() => handlePropertyApproval(property._id, 'approve')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors min-w-[100px]"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handlePropertyApproval(property._id, 'reject')}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors min-w-[100px]"
                              >
                                ✗ Reject
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property._id)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors min-w-[100px]"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* All Properties Tab */}
              {propertiesSubTab === 'all' && (
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600">Manage all properties in the system. You can delete properties that have been sold.</p>
                  </div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-gray-600 mt-4">Loading properties...</p>
                    </div>
                  ) : (!Array.isArray(allProperties) || allProperties.length === 0) ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🏠</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
                      <p className="text-gray-600">No properties in the system yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Array.isArray(allProperties) && allProperties.map((property) => (
                        <div key={property._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{property.title}</h4>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  property.status === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : property.status === 'pending'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {property.status === 'approved' ? '✓ Approved' : 
                                   property.status === 'pending' ? 'Pending Review' : '✗ Rejected'}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-500">Location</p>
                                  <p className="font-medium">{property.location?.city}, {property.location?.state}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Price</p>
                                  <p className="font-medium">₹{property.price?.amount?.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Type</p>
                                  <p className="font-medium capitalize">{property.type}</p>
                                </div>
                              </div>
                              <div className="mb-4">
                                <p className="text-sm text-gray-500">Owner Details</p>
                                <p className="font-medium">{property.owner?.name} • {property.owner?.email}</p>
                                <p className="text-sm text-gray-600">📞 {property.owner?.phone}</p>
                              </div>
                              <p className="text-gray-600 text-sm">{property.description}</p>
                            </div>
                            <div className="flex flex-col space-y-2 ml-6">
                              {property.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handlePropertyApproval(property._id, 'approve')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors min-w-[100px]"
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => handlePropertyApproval(property._id, 'reject')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors min-w-[100px]"
                                  >
                                    ✗ Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteSoldProperty(property._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors min-w-[100px]"
                                title="Delete property (typically after it's sold)"
                              >
                                🗑 Delete (Sold)
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
                    <p className="text-gray-600">Manage your team members and their roles</p>
                  </div>
                  <button
                    onClick={() => setShowAddTeamModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    + Add Team Member
                  </button>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading team members...</p>
                  </div>
                ) : (!Array.isArray(teamMembers) || teamMembers.length === 0) ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                    <p className="text-gray-600">Add your first team member to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(teamMembers) && teamMembers.map((member) => (
                      <div key={member._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {member.profileImage ? (
                              <img
                                src={(() => {
                                  const imagePath = member.profileImage.startsWith('/uploads') 
                                    ? member.profileImage 
                                    : `/uploads/team/${member.profileImage}`;
                                  return `http://localhost:5000${imagePath}?v=${Date.now()}`;
                                })()}
                                alt={member.name}
                                className="w-16 h-16 rounded-full object-cover"
                                onError={(e) => {
                                  console.error(`Failed to load admin panel image for ${member.name}`);
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : (
                              <span className="text-2xl text-gray-600">👤</span>
                            )}
                            <span className="text-2xl text-gray-600" style={{display: 'none'}}>👤</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{member.name}</h4>
                              {member.isBoss && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  CEO
                                </span>
                              )}
                            </div>
                            <p className="text-primary-600 font-medium text-sm">{member.position}</p>
                            <p className="text-gray-500 text-xs capitalize">{member.department}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                          <p className="text-gray-600 truncate">📧 {member.email}</p>
                          <p className="text-gray-600">📞 {member.phone}</p>
                          {member.joiningDate && (
                            <p className="text-gray-500 text-xs">
                              Joined: {new Date(member.joiningDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              member.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              member.showOnWebsite ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {member.showOnWebsite ? 'On Website' : 'Private'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteTeamMember(member._id)}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            disabled={member.isBoss}
                            title={member.isBoss ? "Cannot remove CEO" : "Remove team member"}
                          >
                            {member.isBoss ? 'CEO' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add Team Member Modal */}
            {showAddTeamModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto team-modal-content">
                  <div className="sticky top-0 bg-white pb-4 mb-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Team Member</h3>
                  </div>
                  <form onSubmit={handleAddTeamMember} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter member name"
                        name="name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g. Senior Property Consultant"
                        name="position"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        name="department"
                        defaultValue="sales"
                      >
                        <option value="management">Management</option>
                        <option value="sales">Sales</option>
                        <option value="marketing">Marketing</option>
                        <option value="construction">Construction</option>
                        <option value="legal">Legal</option>
                        <option value="finance">Finance</option>
                        <option value="hr">HR</option>
                        <option value="support">Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter email address"
                        name="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter phone number"
                        name="phone"
                      />
                    </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter password for user account"
                          name="password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          name="userRole"
                          defaultValue="user"
                        >
                          <option value="user">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website Display</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        name="showOnWebsite"
                        defaultValue="true"
                      >
                        <option value="true">Show on Website</option>
                        <option value="false">Private (Admin Only)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        name="profileImage"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddTeamModal(false)}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Add Member
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rentals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Rental Property Management</h3>
                    <p className="text-gray-600">Manage rental properties for tenants</p>
                  </div>
                  <button
                    onClick={() => setShowAddRentalModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    + Add Rental Property
                  </button>
                </div>
              </div>

              {/* Sub-navigation for rentals */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setRentalsSubTab('all')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      rentalsSubTab === 'all'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    All Rental Properties ({rentalProperties.length})
                  </button>
                  <button
                    onClick={() => setRentalsSubTab('pending')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      rentalsSubTab === 'pending'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Pending ({rentalProperties.filter(p => p.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setRentalsSubTab('approved')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      rentalsSubTab === 'approved'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Approved ({rentalProperties.filter(p => p.status === 'approved').length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading rental properties...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      let filteredRentals = rentalProperties;
                      if (rentalsSubTab === 'pending') {
                        filteredRentals = rentalProperties.filter(p => p.status === 'pending');
                      } else if (rentalsSubTab === 'approved') {
                        filteredRentals = rentalProperties.filter(p => p.status === 'approved');
                      }

                      if (filteredRentals.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏘️</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {rentalsSubTab === 'all' ? 'No rental properties yet' : 
                               rentalsSubTab === 'pending' ? 'No pending rental properties' :
                               'No approved rental properties'}
                            </h3>
                            <p className="text-gray-600">
                              {rentalsSubTab === 'all' ? 'Add your first rental property to get started' : 
                               `No ${rentalsSubTab} rental properties found`}
                            </p>
                          </div>
                        );
                      }

                      return filteredRentals.map((property) => (
                        <div key={property._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{property.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  property.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  property.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {property.status}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {property.category}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                <div>📍 {property.location?.city}, {property.location?.state}</div>
                                <div>💰 ₹{property.price?.amount?.toLocaleString()}/month</div>
                                <div>🏠 {property.type} • {property.features?.bedrooms || 0} BHK</div>
                                <div>📐 {property.area?.size} {property.area?.unit}</div>
                              </div>
                              
                              {property.owner && (
                                <div className="text-sm text-gray-600 mb-2">
                                  <strong>Owner:</strong> {property.owner.name} • {property.owner.email}
                                </div>
                              )}
                              
                              <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                            </div>
                            
                            <div className="flex flex-col space-y-2 ml-6">
                              {property.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handlePropertyApproval(property._id, 'approve')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors min-w-[100px]"
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => handlePropertyApproval(property._id, 'reject')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors min-w-[100px]"
                                  >
                                    ✗ Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteSoldProperty(property._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors min-w-[100px]"
                                title="Delete property (typically after it's rented)"
                              >
                                🗑 Delete (Rented)
                              </button>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Add Rental Property Modal */}
            {showAddRentalModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto rental-modal-content">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Add New Rental Property</h3>
                      <button
                        onClick={() => setShowAddRentalModal(false)}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleAddRentalProperty} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="e.g., 2 BHK Apartment in Central Location"
                            name="title"
                            defaultValue="Beautiful Property for Rent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                          <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            name="type"
                            defaultValue="apartment"
                          >
                            <option value="">Select Type</option>
                            <option value="apartment">Apartment</option>
                            <option value="villa">Villa</option>
                            <option value="house">House</option>
                            <option value="office">Office Space</option>
                            <option value="shop">Shop</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="commercial">Commercial</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹) *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="25000"
                            name="rent"
                            defaultValue="25000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="50000"
                            name="deposit"
                            defaultValue="50000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="1200"
                            name="area"
                            defaultValue="1200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            name="bedrooms"
                            defaultValue="1"
                          >
                            <option value="0">Studio</option>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4+ BHK</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            name="bathrooms"
                            defaultValue="1"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="2"
                            name="floor"
                            defaultValue="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Furnished</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            name="furnished"
                            defaultValue="unfurnished"
                          >
                            <option value="unfurnished">Unfurnished</option>
                            <option value="semi-furnished">Semi-furnished</option>
                            <option value="fully-furnished">Fully-furnished</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address *</label>
                        <textarea
                          required
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Building/House number, Street, Area, Landmark"
                          name="address"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Mumbai"
                            name="city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Maharashtra"
                            name="state"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                          <input
                            type="text"
                            required
                            pattern="[0-9]{6}"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="400001"
                            name="pincode"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Description *</label>
                        <textarea
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Describe the property, amenities, nearby facilities, etc."
                          name="description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Images</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          name="images"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload multiple images of the property</p>
                      </div>

                      <div className="flex items-center justify-end space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddRentalModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Add Rental Property
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'users' || activeTab === 'analytics') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;