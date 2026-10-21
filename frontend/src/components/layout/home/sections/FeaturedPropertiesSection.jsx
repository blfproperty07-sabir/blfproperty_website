import React from 'react';
import { Link } from 'react-router-dom';
import PropertyImage from '../../../property/PropertyImage';

const FeaturedPropertiesSection = (featuredProperties = []) => (
  <section className="relative overflow-hidden bg-[#F7F8FC] py-16 sm:py-20">
    <div className="container-custom">
      <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Curated For You
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#17213D] sm:text-4xl lg:text-5xl">
            Handpicked Residential
            <span className="block text-amber-600">Projects</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            Explore carefully selected residential properties chosen for their comfort, location and lifestyle.
          </p>
        </div>

        <Link
          to="/properties"
          className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#17213D] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-amber-500 hover:text-[#17213D]"
        >
          Explore All Properties
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {featuredProperties.slice(0, 2).map((property, index) => (
          <Link
            key={property._id || index}
            to={`/properties/${property._id}`}
            className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-[0_8px_30px_rgba(23,33,61,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-[0_22px_50px_rgba(23,33,61,0.15)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <div className="relative h-64 overflow-hidden bg-gray-200 sm:h-80">
              <PropertyImage
                image={property.images?.[0]}
                alt={property.title || 'Featured Property'}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#111B3C]/90 via-[#111B3C]/10 to-transparent" />

              <div className="absolute left-5 top-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#17213D]/85 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Handpicked Property
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5">
                <div className="mb-2 flex items-center gap-2 text-sm text-white/90">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{property.location?.city || 'Prime Location'}</span>
                </div>
                <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {property.title || 'Featured Residential Property'}
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Property Highlights</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-[#F3F5F9] px-3 py-2 text-sm font-semibold text-[#17213D]">
                      {property.bedrooms || 3} BHK
                    </span>
                    <span className="rounded-lg bg-[#F3F5F9] px-3 py-2 text-sm font-semibold text-[#17213D]">
                      {property.area || 'Spacious Area'}
                    </span>
                    <span className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
                      {property.amenities?.length || 15}+ Amenities
                    </span>
                  </div>
                </div>

                <div className="min-w-0 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">Property Price</p>
                  <p className="mt-1 text-lg font-extrabold text-[#17213D]">
                    {property.price != null
                      ? new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0
                        }).format(property.price)
                      : 'Price on Request'}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-bold text-[#17213D] transition-colors group-hover:text-amber-700">
                  View Property Details
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17213D] text-white transition-all duration-300 group-hover:bg-amber-500 group-hover:text-[#17213D]">
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {featuredProperties.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <p className="font-semibold text-[#17213D]">Featured properties coming soon</p>
          <p className="mt-2 text-sm text-gray-500">Please check back for our handpicked residential listings.</p>
        </div>
      )}
    </div>
  </section>
);

export default FeaturedPropertiesSection;
