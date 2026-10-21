import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = ({ categoryCards = [] }) => (
  <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
    <div className="container-custom">

      {/* Section heading */}
      <div className="mb-9 text-center sm:mb-12">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 sm:text-sm">
          <span className="h-px w-7 bg-amber-500" />
          Explore Real Estate
          <span className="h-px w-7 bg-amber-500" />
        </span>

        <h2 className="mx-auto mt-3 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-[#17213D] sm:text-3xl lg:text-4xl">
          GET STARTED WITH EXPLORING
          <span className="block text-amber-600">REAL ESTATE OPTIONS</span>
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
          Find your next home, discover investment opportunities, or list your property with ease.
        </p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {categoryCards.map((card, index) => (
          <Link
            key={card.id || card.link || index}
            to={card.link}
            className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-[0_18px_38px_rgba(23,33,61,0.12)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            style={{ boxShadow: '0 5px 20px rgba(23,33,61,0.055)' }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100 sm:h-52">
              <img
                src={card.image}
                alt={card.title || 'Real estate category'}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#111B3C]/65 via-transparent to-transparent" />

              {/* Category icon */}
              <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-xl shadow-md transition-colors duration-300 group-hover:bg-amber-400">
                {card.icon}
              </div>

              {/* Property count */}
              {card.stats && (
                <span className="absolute right-3 top-3 max-w-[72%] rounded-lg bg-amber-500 px-3 py-2 text-[11px] font-bold text-white shadow-md sm:text-xs">
                  {card.stats}
                </span>
              )}

              {/* Image bottom label */}
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-xs font-semibold tracking-wide text-white/95">
                  Discover your possibilities
                </span>
              </div>
            </div>

            {/* Card content */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h3 className="text-base font-bold leading-6 text-[#17213D] transition-colors duration-200 group-hover:text-amber-700">
                {card.title}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">
                {card.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-semibold text-amber-700">
                  Explore Now
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F7F2] text-[#17213D] transition-all duration-300 group-hover:bg-[#17213D] group-hover:text-white">
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  </section>
);

export default CategorySection;
