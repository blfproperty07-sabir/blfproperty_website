import React, { useState, useEffect } from 'react';
import { getTeamMemberImageUrl, handleImageError, handleImageLoad } from '../utils/imageUtils';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    // Force a fresh fetch every time component mounts
    setTeamMembers([]); // Clear existing data first
    
    // Use setTimeout to ensure state is cleared before fetch
    setTimeout(() => {
      fetchTeamMembers();
    }, 100);
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team/about');
      const data = await response.json();
      
      if (data.success) {
        const boss = data.data?.boss;
        const members = data.data?.teamMembers || [];
        const allMembers = boss ? [boss, ...members] : members;
        setTeamMembers(allMembers);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    }
  };

  const bossProfile = {
    name: "Inzamam Asad",
    position: "CEO & Founder",
    email: "easypropertysolution123@gmail.com",
    phone: "7033576717 /      9708402172",
    image: "/image/companyboss1.jpg",
    description: "Leading Eazy Property Solution & Construction with over 10 years of experience in real estate development and property solutions. Committed to providing quality properties and exceptional customer service.",
    experience: "10+ Years",
    projects: "500+ Projects",
    clients: "1000+ Happy Clients",
    specialization: ["Real Estate Development", "Property Management", "Construction", "Investment Advisory"],
    achievements: ["Licensed Real Estate Professional", "Certified Property Manager", "Award-winning Developer"]
  };

  const companyStats = [
    { label: "Years of Experience", value: "10+", icon: "📅" },
    { label: "Properties Sold", value: "2,500+", icon: "🏠" },
    { label: "Happy Clients", value: "5,000+", icon: "😊" },
    { label: "Projects Completed", value: "500+", icon: "✅" },
    { label: "Team Members", value: "50+", icon: "👥" },
    { label: "Cities Covered", value: "25+", icon: "🌆" }
  ];

  const services = [
    {
      title: "Property Sales",
      description: "Buy and sell residential and commercial properties with our expert guidance",
      icon: "🏡",
      features: ["Property Valuation", "Market Analysis", "Legal Documentation", "Negotiation Support"]
    },
    {
      title: "Property Rental",
      description: "Find the perfect rental property or rent out your property hassle-free",
      icon: "🔑",
      features: ["Tenant Verification", "Rental Management", "Maintenance Support", "Legal Compliance"]
    },
    {
      title: "Construction Services",
      description: "Complete construction solutions from planning to execution",
      icon: "🏗️",
      features: ["Residential Construction", "Commercial Projects", "Interior Design", "Project Management"]
    },
    {
      title: "Investment Advisory",
      description: "Strategic real estate investment guidance for maximum returns",
      icon: "📈",
      features: ["Market Research", "Investment Planning", "Portfolio Management", "Risk Assessment"]
    },
    {
      title: "Property Management",
      description: "Complete property management services for property owners",
      icon: "🛠️",
      features: ["Maintenance Services", "Tenant Relations", "Financial Management", "Property Monitoring"]
    },
    {
      title: "Legal Support",
      description: "Complete legal assistance for all property-related matters",
      icon: "⚖️",
      features: ["Documentation", "Title Verification", "Registration", "Legal Consultation"]
    }
  ];

  // Only use real API data - no fallback

  const allTeamMembers = teamMembers; // Always use API data only
  
  // Enhanced debug information
  console.log('=== TEAM DISPLAY DEBUG ===');
  console.log('teamMembers from API:', teamMembers.length);
  console.log('teamMembers state:', teamMembers);
  console.log('Final members to display:', allTeamMembers.length);
  console.log('Final allTeamMembers:', allTeamMembers);
  console.log('==========================');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-400 text-white py-20">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Eazy Property</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your trusted partner in real estate solutions with over a decade of excellence in property development and construction services.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
              {companyStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative z-10">
                <img
                  src={bossProfile.image}
                  alt={bossProfile.name}
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl transform rotate-3 opacity-20"></div>
            </div>
            
            <div>
              <div className="mb-6">
                <span className="bg-primary-100 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold">CEO & Founder</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{bossProfile.name}</h2>
              <p className="text-xl text-gray-600 mb-6">{bossProfile.description}</p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center bg-white rounded-lg shadow-md p-4">
                  <div className="text-2xl font-bold text-primary-600">{bossProfile.experience}</div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
                <div className="text-center bg-white rounded-lg shadow-md p-4">
                  <div className="text-2xl font-bold text-primary-600">{bossProfile.projects}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center bg-white rounded-lg shadow-md p-4">
                  <div className="text-2xl font-bold text-primary-600">{bossProfile.clients}</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {bossProfile.specialization.map((spec, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`mailto:${bossProfile.email}`}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center justify-center"
                >
                  📧 Email: {bossProfile.email}
                </a>
                <a
                  href={`tel:${bossProfile.phone}`}
                  className="bg-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition inline-flex items-center justify-center"
                >
                  📞 Call: {bossProfile.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive real estate solutions tailored to meet all your property needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <span className="text-primary-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Expert Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our dedicated professionals who make your property dreams come true
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTeamMembers.length > 0 ? (
              allTeamMembers.map((member, index) => (
                <div key={member._id || index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={getTeamMemberImageUrl(member.profileImage)}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                      onLoad={() => handleImageLoad(member.name)}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-primary-600 font-semibold mb-3">{member.position}</p>
                    <p className="text-gray-600 text-sm mb-4">
                      {(() => {
                        // Handle experience display
                        let experienceText = '';
                        if (member.experience) {
                          if (typeof member.experience === 'object' && member.experience.years !== undefined) {
                            // Handle database object format
                            const years = member.experience.years;
                            if (years === 0) {
                              experienceText = 'Fresher';
                            } else if (years === 1) {
                              experienceText = '1 year experience';
                            } else {
                              experienceText = `${years} years experience`;
                            }
                          } else if (typeof member.experience === 'string') {
                            // Handle sample data string format
                            experienceText = member.experience;
                          }
                        }
                        
                        // Handle specialization
                        let specializationText = '';
                        if (member.experience?.specializations && Array.isArray(member.experience.specializations) && member.experience.specializations.length > 0) {
                          specializationText = ` in ${member.experience.specializations.join(', ')}`;
                        } else if (member.specialization) {
                          specializationText = ` in ${member.specialization}`;
                        }
                        
                        // Handle department
                        let departmentText = '';
                        if (member.department) {
                          departmentText = ` • ${member.department.charAt(0).toUpperCase() + member.department.slice(1)}`;
                        }
                        
                        return experienceText + specializationText + departmentText;
                      })()}
                    </p>
                    
                    <div className="space-y-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="text-sm text-gray-600 hover:text-primary-600 transition flex items-center"
                      >
                        📧 {member.email}
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="text-sm text-gray-600 hover:text-primary-600 transition flex items-center"
                      >
                        📞 {member.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Team Members...</h3>
                <p className="text-gray-600">Please wait while we fetch our team information.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact us today and let our expert team help you find the perfect property that meets all your needs and budget.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition inline-flex items-center justify-center"
            >
              Get In Touch
            </a>
            <a
              href="/properties"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary-600 transition inline-flex items-center justify-center"
            >
              View Properties
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;