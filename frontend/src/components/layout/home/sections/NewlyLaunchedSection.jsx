import React from 'react';
import { Link } from 'react-router-dom';
import PropertyImage from '../../../property/PropertyImage';

const NewlyLaunchedSection = (newlyLaunched = [], formatCurrency, formatArea) => (
  <section className="relative overflow-hidden bg-[#F8F7F4] py-16 md:py-20">
    <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />
    <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

    <div className="container-custom relative z-10">
      <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-amber-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Fresh on the Market
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#17213D] sm:text-4xl md:text-5xl">
            Newly Launched
            <span className="block text-amber-600">Projects</span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore newly launched properties with modern amenities, spacious layouts and locations worth investing in.
          </p>
        </div>

        <Link
          to="/properties"
          className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#17213D]/15 bg-white px-5 py-3 text-sm font-bold text-[#17213D] shadow-sm transition-all duration-300 hover:border-amber-400 hover:bg-[#17213D] hover:text-white"
        >
          Explore All Projects
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newlyLaunched.map((property, index) => (
          <Link
            key={property._id || index}
            to={`/properties/${property._id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-[0_5px_24px_rgba(23,33,61,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-[0_20px_45px_rgba(23,33,61,0.15)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <div className="relative h-60 overflow-hidden bg-gray-100 sm:h-64">
              <PropertyImage
                image={property.images?.[0]}
                alt={property.title || 'Property Image'}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#111B3C]/85 via-[#111B3C]/10 to-transparent" />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#17213D]/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  New Launch
                </span>
                <span className="rounded-full border border-emerald-200/40 bg-emerald-600/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                  ✓ RERA Approved
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/90">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{property.location?.city || 'Prime Location'}</span>
                </div>

                <h3 className="line-clamp-2 text-xl font-bold leading-snug text-white sm:text-2xl">
                  {property.title}
                </h3>
              </div>

              <div className="absolute right-4 top-4 rounded-xl border border-white/60 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md">
                <div className="text-[10px] font-medium text-gray-500">Starting from</div>
                <div className="text-base font-extrabold text-[#17213D]">
                  {typeof formatCurrency === 'function' ? formatCurrency(property.price) : property.price}
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 bg-[#F8F7F4] p-3 transition-colors group-hover:border-amber-100">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Configuration</div>
                  <div className="mt-1 text-sm font-bold text-[#17213D]">
                    {property.bedrooms || '3'} BHK
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#F8F7F4] p-3 transition-colors group-hover:border-amber-100">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Carpet Area</div>
                  <div className="mt-1 text-sm font-bold text-[#17213D]">
                    {typeof formatArea === 'function' ? (formatArea(property.area) || '1200') : (property.area || '1200')}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ready to Move
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-800">
                  {property.amenities?.length || 15}+ Amenities
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-bold text-[#17213D] transition-colors group-hover:text-amber-700">
                  View Project Details
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17213D] text-white transition-all duration-300 group-hover:bg-amber-500 group-hover:text-[#17213D]">
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {newlyLaunched.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center">
          <p className="font-semibold text-[#17213D]">New projects coming soon</p>
          <p className="mt-2 text-sm text-gray-500">Please check back for the latest listings.</p>
        </div>
      )}

      <div className="mt-8 text-center md:hidden">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 rounded-xl bg-[#17213D] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-amber-500 hover:text-[#17213D]"
        >
          Explore All Projects
          <span>→</span>
        </Link>
      </div>
    </div>
  </section>
);

export default NewlyLaunchedSection;
