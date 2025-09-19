import React from 'react';

export default function Insights() {
  const constructionProjects = [
    {
      id: 1,
      title: "2BHK Budget Apartment Construction",
      image: "/image/2bhk-budget-flat.jpg",
      description: "Affordable housing solutions with modern amenities and quality construction materials.",
      features: ["Cost-effective design", "Quality materials", "Timely delivery", "Modern amenities"]
    },
    {
      id: 2,
      title: "2BHK Modern Apartment Development",
      image: "/image/2bhk-modern-apartment.jpg",
      description: "Contemporary apartment designs with smart space utilization and premium finishes.",
      features: ["Modern architecture", "Smart layouts", "Premium finishes", "Energy efficient"]
    },
    {
      id: 3,
      title: "3BHK Luxury Flat Construction",
      image: "/image/3bhk-luxury-flat.jpg",
      description: "Luxurious residential spaces with high-end specifications and premium locations.",
      features: ["Luxury interiors", "Premium location", "High-end fixtures", "Spacious design"]
    },
    {
      id: 4,
      title: "4BHK Villa Development",
      image: "/image/4bhk-villa.jpg",
      description: "Independent villa construction with private gardens and premium amenities.",
      features: ["Private gardens", "Independent design", "Premium amenities", "Custom layouts"]
    },
    {
      id: 5,
      title: "5BHK Independent House",
      image: "/image/5bhk-independent-house.jpg",
      description: "Large family homes with spacious rooms and modern construction techniques.",
      features: ["Spacious rooms", "Family-friendly", "Modern techniques", "Custom designs"]
    },
    {
      id: 6,
      title: "Office Space Construction",
      image: "/image/Office.jpg",
      description: "Commercial office spaces designed for productivity and modern business needs.",
      features: ["Business-ready", "Modern facilities", "Flexible layouts", "Professional design"]
    }
  ];

  const companyInfo = {
    banner: "/image/company-banner.jpg",
    logo: "/image/eazy-property-logo.png",
    fallbackLogo: "/image/EAZY PROPERTY SOLUTION comapy logo.png",
    bossImage: "/image/companyboss1.jpg"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          .shimmer {
            background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          
          .floating {
            animation: float 3s ease-in-out infinite;
          }
          
          .rotating {
            animation: rotate 20s linear infinite;
          }
        `
      }} />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced Floating Geometric Shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 opacity-15 rounded-full floating"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white opacity-10 transform rotate-45 floating" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-300 opacity-20 rounded-full floating" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white opacity-15 transform rotate-12 rotating"></div>
          
          {/* Additional Floating Elements */}
          <div className="absolute top-1/3 left-1/3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full floating opacity-25" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-2/3 right-1/4 w-8 h-8 bg-white rounded-full floating opacity-30" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-20 w-6 h-6 border-4 border-yellow-400 transform rotate-45 rotating opacity-40" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/3 right-10 w-10 h-10 border-3 border-white rounded-full floating opacity-25" style={{animationDelay: '2.5s'}}></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            {/* Enhanced Logo Section */}
            <div className="mb-12 flex justify-center">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-300 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-110"></div>
                
                {/* Logo Container */}
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-500 border-4 border-white/20">
                  <img 
                    src={companyInfo.logo} 
                    alt="Eazy Property Solution Logo" 
                    className="h-24 md:h-28 w-auto object-contain"
                    onError={(e) => {
                      e.target.src = companyInfo.fallbackLogo;
                      e.target.onerror = function() {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        parent.innerHTML = `
                          <div class="text-orange-600 font-bold text-3xl md:text-4xl px-6 py-4 text-center">
                            <div class="text-4xl mb-2">🏗️</div>
                            EAZY PROPERTY<br/>
                            <span class="text-xl">SOLUTION & CONSTRUCTION</span>
                          </div>
                        `;
                      };
                    }}
                  />
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Title with Animation */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-orange-200 bg-clip-text text-transparent animate-pulse">
                    Construction
                  </span>
                  {/* Underline Animation */}
                  <div className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-300 rounded-full transform scale-x-0 animate-ping"></div>
                </span>
                <br />
                <span className="text-white drop-shadow-2xl">Insights</span>
              </h1>
            </div>
            
            {/* Enhanced Description */}
            <p className="text-xl md:text-3xl mb-12 max-w-5xl mx-auto leading-relaxed text-orange-100 font-light">
              Discover our <span className="font-bold text-yellow-300">expertise</span> in construction and real estate development with 
              <span className="font-bold text-yellow-300"> quality projects</span> and <span className="font-bold text-yellow-300">innovative solutions</span>.
            </p>
            
            {/* Enhanced Achievement Stats with Unique Design */}
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 text-center transform group-hover:scale-105 transition-all duration-300">
                  <div className="text-5xl md:text-6xl font-bold text-yellow-300 mb-2 animate-pulse">20+</div>
                  <div className="text-sm md:text-lg text-orange-200 font-medium">Years Experience</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 text-center transform group-hover:scale-105 transition-all duration-300">
                  <div className="text-5xl md:text-6xl font-bold text-yellow-300 mb-2 animate-pulse">500+</div>
                  <div className="text-sm md:text-lg text-orange-200 font-medium">Projects Completed</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 text-center transform group-hover:scale-105 transition-all duration-300">
                  <div className="text-5xl md:text-6xl font-bold text-yellow-300 mb-2 animate-pulse">100%</div>
                  <div className="text-sm md:text-lg text-orange-200 font-medium">Satisfaction Rate</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Banner Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative">
                Our Construction Excellence
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              With years of experience in construction and real estate, we deliver quality projects that exceed expectations and build lasting relationships.
            </p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
            <img 
              src={companyInfo.banner} 
              alt="Company Banner" 
              className="w-full h-80 md:h-[500px] object-cover"
              onError={(e) => {
                // If banner image fails, create a beautiful gradient background
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                parent.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)';
                parent.style.position = 'relative';
                parent.innerHTML += `
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center text-white p-8">
                      <div class="text-6xl md:text-8xl font-bold mb-4 opacity-90">🏗️</div>
                      <h3 class="text-3xl md:text-5xl font-bold mb-4">Building Excellence</h3>
                      <p class="text-xl md:text-2xl opacity-90">Quality Construction | Timely Delivery | Customer Satisfaction</p>
                    </div>
                  </div>
                `;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h3 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  Building Dreams Into Reality
                </h3>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                  <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-semibold">
                    Quality Construction
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-semibold">
                    Timely Delivery
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-semibold">
                    Customer Satisfaction
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Construction Projects Grid */}
      <div className="py-24 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 relative">
                Our Construction Projects
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-full"></div>
                {/* Decorative dots */}
                <div className="absolute -top-6 -right-6 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              </h2>
            </div>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Explore our <span className="font-bold text-orange-600">diverse range</span> of construction projects from 
              <span className="font-bold text-orange-600"> budget-friendly</span> to <span className="font-bold text-orange-600">luxury developments</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {constructionProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-4"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                {/* Decorative Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-transparent to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Image Section with Advanced Styling */}
                <div className="relative overflow-hidden h-64">
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.style.background = `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`;
                      parent.innerHTML += `
                        <div class="absolute inset-0 flex items-center justify-center z-20">
                          <div class="text-center text-white p-6">
                            <div class="text-6xl mb-4 animate-bounce">🏠</div>
                            <div class="text-lg font-bold">${project.title.split(' ').slice(0, 2).join(' ')}</div>
                            <div class="text-sm opacity-90 mt-2">Premium Construction</div>
                          </div>
                        </div>
                      `;
                    }}
                  />
                  
                  {/* Floating Construction Badge */}
                  <div className="absolute top-6 right-6 z-20">
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 border-2 border-white/20">
                      <span className="flex items-center gap-2">
                        🏗️ Construction
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover Overlay with Quick Info */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                      <div className="text-sm font-semibold text-gray-800">Quick Preview</div>
                      <div className="text-xs text-gray-600 mt-1">Tap to learn more about this project</div>
                    </div>
                  </div>
                </div>
                
                {/* Content Section with Enhanced Typography */}
                <div className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {project.description}
                  </p>
                  
                  {/* Enhanced Features List */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                      ✨ Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {project.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex} 
                          className="flex items-center space-x-3 group-hover:transform group-hover:translate-x-1 transition-transform duration-300"
                          style={{transitionDelay: `${featureIndex * 0.1}s`}}
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex-shrink-0 shadow-lg animate-pulse"></div>
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
                
                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Call to Action Button */}
          <div className="text-center mt-16">
            <a 
              href="/properties" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white/20"
            >
              <span>🏗️</span>
              View All Projects
              <span className="animate-bounce">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* CEO/Leadership Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative">
                Our Leadership
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the visionary behind our construction excellence and commitment to quality.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 via-white to-yellow-50 rounded-2xl p-8 md:p-16 shadow-2xl border border-orange-100">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-2/5 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full blur-2xl opacity-20 scale-110"></div>
                    <img 
                      src={companyInfo.bossImage} 
                      alt="Company Leadership" 
                      className="relative w-64 h-64 rounded-full object-cover shadow-2xl border-4 border-white"
                      onError={(e) => {
                        // Create a professional avatar placeholder
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        parent.innerHTML += `
                          <div class="relative w-64 h-64 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 shadow-2xl border-4 border-white flex items-center justify-center">
                            <div class="text-center text-white">
                              <div class="text-6xl mb-2">👨‍💼</div>
                              <div class="text-lg font-bold">Leadership</div>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
                
                <div className="lg:w-3/5 text-center lg:text-left">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    Leading Construction Innovation
                  </h3>
                  <blockquote className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed italic">
                    "Our commitment to quality construction and customer satisfaction drives everything we do. 
                    We believe in building not just structures, but lasting relationships with our clients through 
                    transparent processes and exceptional craftsmanship."
                  </blockquote>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform">
                      <div className="text-2xl font-bold">20+</div>
                      <div className="text-sm opacity-90">Years Experience</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-6 py-4 rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform">
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-sm opacity-90">Projects Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white px-6 py-4 rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform">
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm opacity-90">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Construction Process Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Construction Process
            </h2>
            <p className="text-lg text-gray-600">
              A systematic approach to deliver quality construction projects on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Planning & Design</h3>
              <p className="text-gray-600">Detailed project planning and architectural design development</p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Site Preparation</h3>
              <p className="text-gray-600">Site survey, soil testing, and foundation preparation</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Construction</h3>
              <p className="text-gray-600">Quality construction with regular monitoring and updates</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Handover</h3>
              <p className="text-gray-600">Final inspection, quality check, and project delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-yellow-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Construction Project?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get in touch with our construction experts to discuss your project requirements and get a personalized quote.
          </p>
          <div className="space-x-4">
            <a 
              href="/contact" 
              className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Contact Us
            </a>
            <a 
              href="/properties" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors inline-block"
            >
              View Projects
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}