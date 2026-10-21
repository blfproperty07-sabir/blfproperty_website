import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../common/brand/BrandLogo';

const AuthPageLayout = ({ title, subtitle, children }) => (
  <div className="grid min-h-screen place-items-center bg-[#f4f5f7] px-4 py-6 sm:px-6 lg:px-8">
    <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:min-h-[660px] lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="relative hidden min-h-[260px] overflow-hidden bg-slate-900 text-white md:flex md:flex-col md:justify-between">
        <img
          src="/image/herosection.png"
          alt="A modern home at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/15" />

        <Link to="/" className="relative z-10 m-9 inline-flex w-fit items-center gap-3 text-white no-underline">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-1.5">
            <BrandLogo className="h-full w-full object-contain" />
          </span>
          <span>
            <span className="block text-base font-bold">BLF Property</span>
            <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">
              Trusted property solutions
            </span>
          </span>
        </Link>

        <div className="relative z-10 max-w-lg p-9 pb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/75">
            Find your next home
          </p>
          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            A better place to start your next chapter.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-white/80">
            Browse properties, compare your options, and connect with the people who can help you move forward.
          </p>
        </div>
      </aside>

      <section className="flex items-center justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline hover:text-slate-900">
            <BrandLogo className="h-8 w-8 rounded-md border border-slate-200 bg-white p-1 object-contain lg:hidden" />
            <span className="lg:hidden">BLF Property</span>
            <span className="hidden lg:inline">Back to home</span>
          </Link>

          <header className="mb-7">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          </header>

          {children}

          <p className="mt-7 text-center text-xs leading-5 text-slate-400">
            Your details are used only to manage your BLF Property account.
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default AuthPageLayout;
