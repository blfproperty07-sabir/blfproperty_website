import React, { useState } from 'react';
import {
  Home, MapPin, Search, ChevronDown, 
  ShieldCheck, Building2, IndianRupee, Headset
} from 'lucide-react';

const typeLabel = (item) =>
  typeof item === 'string' ? item : item.label || item.name || item.value || '';

const typeValue = (item) =>
  typeof item === 'string' ? item : item.value || item.id || item.label || item.name || '';
const CustomDropdown = ({ name, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => String(option.value) === String(value));
  const currentLabel = selected ? selected.label : (options[0]?.label || '');

  return (
    <div className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={`flex h-full min-h-[38px] w-full items-center justify-between gap-2 rounded-lg border bg-white px-2.5 text-left text-sm font-medium text-[#111B3C] transition ${
          open
            ? 'border-[#E99A12] ring-2 ring-[#E99A12]/15'
            : 'border-transparent hover:border-slate-200'
        }`}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close dropdown"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            className="absolute left-0 top-[calc(100%+8px)] z-50 max-h-72 w-full min-w-[220px] overflow-y-auto rounded-2xl border border-white bg-white p-2 shadow-[0_20px_55px_rgba(17,27,60,0.22)] ring-1 ring-[#111B3C]/5"
          >
            {options.map((option) => {
              const active = String(option.value) === String(value);

              return (
                <button
                  key={`${name}-${option.value}`}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange({ target: { name, value: option.value } });
                    setOpen(false);
                  }}
                  className={`mb-1 flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-all duration-150 last:mb-0 ${
                    active
                      ? 'bg-gradient-to-r from-[#FFF1D2] to-[#FFF8EC] font-semibold text-[#111B3C] ring-1 ring-inset ring-[#E99A12]/20'
                      : 'text-slate-700 hover:bg-[#FFF8EC] hover:text-[#111B3C] hover:ring-1 hover:ring-inset hover:ring-[#E99A12]/15'
                  }`}
                >
                  <span>{option.label}</span>
                  {active && (
                    <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E99A12] text-xs font-bold text-white">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
const HeroSection = ({
  searchForm,
  handleSearchInputChange,
  handleSearch,
  tabs,
  handleTabChange,
  PROPERTY_TYPES
}) => {
  const propertyTypes = Array.isArray(PROPERTY_TYPES) ? PROPERTY_TYPES : [];

  const tabItems = Array.isArray(tabs) && tabs.length
    ? tabs
    : [
        { label: 'Buy', value: 'Buy' },
        { label: 'Rent', value: 'Rent' },
        { label: 'Projects', value: 'Projects' }
      ];

  const getTabLabel = (tab) =>
    typeof tab === 'string' ? tab : tab.label || tab.name || tab.title || tab.value || '';

  const getTabValue = (tab) =>
    typeof tab === 'string' ? tab : tab.value || tab.id || tab.label || tab.name || '';

  return (
    <section className="relative isolate min-h-[780px] overflow-hidden bg-[#111B3C] sm:min-h-[820px]">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/image/herosection.png')" }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#171923]/45 via-[#171923]/15 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#171923]/25 via-transparent to-white/10"
        aria-hidden="true"
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-5 pb-8 pt-12 sm:px-8 sm:pt-14 lg:px-12 lg:pt-16">
        <div className="max-w-4xl">
          

          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Discover a Better
            <br className="hidden sm:block" /> Way to{' '}
            <span className="text-[#F5A623]">Find Home</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
            Buy, sell or rent properties with confidence. Explore verified
            listings, modern projects and premium homes across top locations.
          </p>
        </div>

        <div className="mt-6 mx-auto w-full max-w-[960px] rounded-[22px] border border-white/60 bg-white/30 p-3 shadow-[0_24px_80px_rgba(30,25,15,0.18)] backdrop-blur-2xl sm:mt-6 sm:p-3 lg:p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {tabItems.map((tab, index) => {
              const label = getTabLabel(tab);
              const value = getTabValue(tab);
              const active =
                String(searchForm?.listingType || searchForm?.activeTab || '')
                  .toLowerCase() === String(value).toLowerCase() ||
                String(searchForm?.listingType || '').toLowerCase() ===
                  String(label).toLowerCase();

              return (
                <button
                  key={`${label}-${index}`}
                  type="button"
                  onClick={() => handleTabChange(value)}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 focus:ring-offset-transparent ${
                    active
                      ? 'bg-[#E99A12] text-white shadow-lg shadow-[#E99A12]/25'
                      : 'border border-white/40 bg-white/35 text-[#111B3C] hover:bg-white/70'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch(event);
            }}
            className="rounded-2xl bg-white/95 p-3 shadow-[0_12px_35px_rgba(17,27,60,0.10)] sm:p-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-3">
                <label htmlFor="hero-location" className="mb-1.5 block text-[11px] font-bold tracking-wide text-[#47516A]">
                  Location
                </label>
                <div className="flex h-[40px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#E99A12] focus-within:ring-2 focus-within:ring-[#E99A12]/15">
                  <MapPin size={19} className="shrink-0 text-[#E99A12]" />
                  <input
                    id="hero-location"
                    type="text"
                    name="location"
                    value={searchForm?.location || ''}
                    onChange={handleSearchInputChange}
                    placeholder="Enter location"
                    className="min-w-0 w-full bg-transparent text-sm text-[#111B3C]  placeholder:text-slate-400 appearance-none border-0 outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label htmlFor="hero-property-type" className="mb-1.5 block text-[11px] font-bold tracking-wide text-[#47516A]">
                  Property Type
                </label>
                <div className="relative flex h-[40px] items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-[#E99A12] focus-within:ring-2 focus-within:ring-[#E99A12]/15">
                  <Home size={19} className="ml-4 shrink-0 text-[#111B3C]" />
                  <CustomDropdown
  name="type"
  value={searchForm?.type || ''}
  onChange={handleSearchInputChange}
  options={[
    { label: 'All Types', value: '' },
    ...propertyTypes.map((type) => ({
      label: typeLabel(type),
      value: typeValue(type)
    }))
  ]}
/>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 text-slate-500" />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="hero-min-price" className="mb-1.5 block text-[11px] font-bold tracking-wide text-[#47516A]">
                  Minimum Budget
                </label>
                <div className="relative flex h-[40px] items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-[#E99A12] focus-within:ring-2 focus-within:ring-[#E99A12]/15">
                  <IndianRupee size={18} className="ml-3 shrink-0 text-slate-500" />
                  <CustomDropdown
  name="minPrice"
  value={searchForm?.minPrice || ''}
  onChange={handleSearchInputChange}
  options={[
    { label: 'Any Budget', value: '' },
    { label: '10 Lakh', value: '1000000' },
    { label: '25 Lakh', value: '2500000' },
    { label: '50 Lakh', value: '5000000' },
    { label: '75 Lakh', value: '7500000' },
    { label: '1 Crore', value: '10000000' }
  ]}
/>
                  <ChevronDown size={15} className="pointer-events-none absolute right-2 text-slate-500" />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="hero-max-price" className="mb-1.5 block text-[11px] font-bold tracking-wide text-[#47516A]">
                  Maximum Budget
                </label>
                <div className="relative flex h-[40px] items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-[#E99A12] focus-within:ring-2 focus-within:ring-[#E99A12]/15">
                  <IndianRupee size={18} className="ml-3 shrink-0 text-slate-500" />
                  <CustomDropdown
  name="maxPrice"
  value={searchForm?.maxPrice || ''}
  onChange={handleSearchInputChange}
  options={[
    { label: 'No Limit', value: '' },
    { label: '25 Lakh', value: '2500000' },
    { label: '50 Lakh', value: '5000000' },
    { label: '75 Lakh', value: '7500000' },
    { label: '1 Crore', value: '10000000' },
    { label: '2 Crore', value: '20000000' },
    { label: '5 Crore+', value: '50000000' }
  ]}
/>
                  <ChevronDown size={15} className="pointer-events-none absolute right-2 text-slate-500" />
                </div>
              </div>

              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="flex h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F5AC27] to-[#E99A12] px-3 text-xs font-bold text-white shadow-lg whitespace-nowrap shadow-[#E99A12]/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#E99A12] focus:ring-offset-2"
                >
                  <Search size={19} />
                  <span>Search Properties</span>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/35 pt-3 md:grid-cols-4 md:gap-3">
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white">
                <ShieldCheck size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Verified Listings</p>
                <p className="mt-1 text-xs text-white/75">100% Genuine Properties</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white">
                <Building2 size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Top Locations</p>
                <p className="mt-1 text-xs text-white/75">Prime Residential Areas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white">
                <IndianRupee size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Best Deals</p>
                <p className="mt-1 text-xs text-white/75">Competitive Prices</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white">
                <Headset size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Expert Support</p>
                <p className="mt-1 text-xs text-white/75">Guidance at Every Step</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
