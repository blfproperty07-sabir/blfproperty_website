import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTeamMemberImageUrl } from "../utils/imageUtils";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

const companyStats = [
  { value: "10+", label: "Years of Experience" },
  { value: "2,500+", label: "Properties Sold" },
  { value: "5,000+", label: "Happy Clients" },
  { value: "500+", label: "Projects Completed" },
  { value: "50+", label: "Team Members" },
  { value: "25+", label: "Cities Covered" }
];

const services = [
  {
    number: "01",
    title: "Property Sales",
    description: "Buy or sell residential and commercial properties with professional guidance.",
    features: ["Property valuation", "Market analysis", "Legal documentation", "Negotiation support"]
  },
  {
    number: "02",
    title: "Property Rental",
    description: "Find a suitable rental property or manage your property rental journey.",
    features: ["Tenant verification", "Rental management", "Maintenance support", "Documentation"]
  },
  {
    number: "03",
    title: "Construction Services",
    description: "Plan and execute residential and commercial construction projects.",
    features: ["Residential construction", "Commercial projects", "Interior design", "Project management"]
  },
  {
    number: "04",
    title: "Investment Advisory",
    description: "Make informed property decisions with research-led investment guidance.",
    features: ["Market research", "Investment planning", "Portfolio guidance", "Risk assessment"]
  },
  {
    number: "05",
    title: "Property Management",
    description: "Practical property management support for owners and investors.",
    features: ["Property maintenance", "Tenant coordination", "Financial records", "Property monitoring"]
  },
  {
    number: "06",
    title: "Legal Support",
    description: "Get assistance with property documentation and transaction requirements.",
    features: ["Document assistance", "Title verification support", "Registration guidance", "Legal consultation"]
  }
];

const CheckIcon = ({ className = "h-4 w-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const ArrowIcon = ({ className = "h-4 w-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const getTeamImage = (member) => {
  return getTeamMemberImageUrl(member?.profileImage);
};

const getTeamExperience = (member) => {
  const parts = [];
  const experience = member?.experience;

  if (experience && typeof experience === "object" && experience.years !== undefined) {
    const years = experience.years;

    parts.push(
      years === 0
        ? "Fresher"
        : `${years} ${years === 1 ? "year" : "years"} experience`
    );
  } else if (typeof experience === "string") {
    parts.push(experience);
  }

  const specializations = experience?.specializations;

  if (Array.isArray(specializations) && specializations.length > 0) {
    parts.push(specializations.join(", "));
  } else if (member?.specialization) {
    parts.push(member.specialization);
  }

  if (member?.department) {
    parts.push(
      member.department.charAt(0).toUpperCase() + member.department.slice(1)
    );
  }

  return parts.join(" · ");
};

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/team/about`);

        if (!response.ok) {
          throw new Error(`Team request failed: ${response.status}`);
        }

        const data = await response.json();

        if (mounted) {
          setTeamMembers(
            data.success && Array.isArray(data.data?.teamMembers)
              ? data.data.teamMembers
              : []
          );
        }
      } catch (error) {
        console.error("Error fetching team members:", error);

        if (mounted) {
          setTeamMembers([]);
        }
      } finally {
        if (mounted) {
          setTeamLoading(false);
        }
      }
    };

    fetchTeamMembers();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF8F3] text-[#29251F]">

      {/* Premium hero */}
      <section className="relative isolate overflow-hidden bg-[#29251F] text-white">
        <div className="absolute inset-0 -z-20">
          <img
            src="/image/herosection.png"
            alt=""
            className="h-full w-full object-cover opacity-55"
            onError={(event) => {
              event.currentTarget.src = "/image/muz1.jpg";
              event.currentTarget.onerror = null;
            }}
          />
        </div>

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#29251F]/70 via-[#29251F]/35 to-transparent" />
        <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="container-custom relative py-10 sm:py-12 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">

            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.19em] text-amber-300 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                About BLF Property
              </div>

              <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
                A better way to
                <span className="mt-1 block text-amber-400">find your place.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                Your trusted partner in real estate solutions, property services
                and construction. We help make every property decision more
                informed, confident and straightforward.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-[#29251F] shadow-lg shadow-amber-950/20 transition duration-300 hover:bg-amber-300"
                >
                  Explore Properties
                  <ArrowIcon />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
                >
                  Talk to Our Team
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-amber-400" />
                  Property guidance
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-amber-400" />
                  Multiple real estate services
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <div className="absolute -right-3 -top-3 h-full w-full rounded-3xl border border-amber-300/35 sm:-right-4 sm:-top-4" />

              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-sm">
                <img
                  src="/image/4bhk-villa.jpg"
                  alt="Residential property"
                  className="h-56 w-full rounded-2xl object-cover sm:h-72"
                  onError={(event) => {
                    event.currentTarget.src = "/image/muz1.jpg";
                    event.currentTarget.onerror = null;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company statistics */}
      <section className="relative z-10 -mt-1 py-3 sm:py-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(41,37,31,0.06)] sm:grid-cols-3 lg:grid-cols-6">
            {companyStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-3 py-3 text-center sm:px-4 sm:py-4 ${
                  index !== companyStats.length - 1
                    ? "border-r border-gray-100"
                    : ""
                } ${index >= 2 ? "border-t border-gray-100 lg:border-t-0" : ""}`}
              >
                <p className="text-xl font-extrabold tracking-tight text-[#29251F] sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mx-auto mt-2 max-w-28 text-xs leading-5 text-gray-500 sm:text-sm">
                  {stat.label}
                </p>
                <div className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-amber-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company overview */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container-custom">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -bottom-4 -left-4 h-3/4 w-3/4 rounded-3xl bg-amber-100" />

              <div className="relative rounded-3xl border border-gray-100 bg-white p-3 shadow-[0_18px_45px_rgba(41,37,31,0.10)]">
                <img
                  src="/image/5bhk-independent-house.jpg"
                  alt="Residential property and real estate"
                  className="h-56 w-full rounded-2xl object-cover sm:h-72"
                  onError={(event) => {
                    event.currentTarget.src = "/image/muz1.jpg";
                    event.currentTarget.onerror = null;
                  }}
                />

                <div className="absolute bottom-7 left-7 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-lg sm:bottom-9 sm:left-9">
                  <img
                    src="/image/blf_logo.png"
                    alt="BLF Property"
                    className="h-12 w-12 rounded-xl border border-gray-100 bg-white object-contain p-1"
                  />
                  <div className="pr-2">
                    <p className="text-sm font-extrabold text-[#29251F]">BLF Property</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Trusted Property Solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                <span className="h-0.5 w-7 rounded-full bg-amber-500" />
                Who We Are
              </p>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#29251F] sm:text-4xl">
                Building trust in every property decision.
              </h2>

              <p className="mt-5 text-base leading-7 text-gray-600">
                BLF Property is committed to transparent guidance, quality
                construction and reliable property services across residential
                and commercial spaces.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
                From finding the right property to construction, rental
                assistance and investment guidance, our services are designed
                to support customers throughout their property journey.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Clear and straightforward communication",
                  "Services for different property requirements",
                  "A customer-focused approach to property decisions"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-sm leading-6 text-gray-700 sm:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#29251F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#484237]"
                >
                  Browse Properties
                  <ArrowIcon />
                </Link>

                <a
                  href="mailto:blfproperty@gmail.com"
                  className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#29251F] transition hover:border-amber-400"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and approach */}
      <section className="border-y border-gray-100 bg-white py-8 sm:py-10">
        <div className="container-custom">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              What Guides Us
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#29251F] sm:text-4xl">
              Property decisions, made clearer.
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              A straightforward approach built around the needs of every customer.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Trust & Transparency",
                description: "We value clear communication and straightforward guidance throughout the property journey."
              },
              {
                number: "02",
                title: "Quality & Care",
                description: "We focus on practical solutions and attention to detail across our property-related services."
              },
              {
                number: "03",
                title: "Customer First",
                description: "We aim to understand each customer's requirements and help them explore relevant options."
              }
            ].map((item) => (
              <article
                key={item.number}
                className="group rounded-xl border border-gray-100 bg-[#F5F1E8] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:bg-white hover:shadow-[0_12px_30px_rgba(41,37,31,0.07)] sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#29251F] text-sm font-extrabold text-amber-300 transition-colors group-hover:bg-amber-400 group-hover:text-[#29251F]">
                  {item.number}
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#29251F]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#FAF8F3] py-8 sm:py-10 lg:py-12">
        <div className="container-custom">

          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                <span className="h-0.5 w-6 rounded-full bg-amber-500" />
                What We Do
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#29251F] sm:text-3xl">
                Our Services
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                Complete real estate solutions, thoughtfully tailored to your needs.
              </p>
            </div>

            <Link
              to="/contact"
              className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-[#29251F] transition-colors hover:text-amber-700"
            >
              Discuss your requirements
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="group flex h-full min-w-0 flex-col rounded-xl border border-[#ECE7DD] bg-white p-4 shadow-[0_2px_10px_rgba(41,37,31,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_10px_25px_rgba(41,37,31,0.08)] sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FBF3E2] text-xs font-extrabold text-amber-800 transition-colors group-hover:bg-amber-400 group-hover:text-[#29251F]">
                    {service.number}
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 text-gray-400 transition-all group-hover:border-amber-200 group-hover:text-amber-700">
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold leading-6 text-[#29251F] transition-colors group-hover:text-amber-800">
                  {service.title}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">
                  {service.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex min-w-0 items-start gap-1.5 rounded-lg bg-[#FAF8F3] px-2.5 py-2 text-xs leading-4 text-gray-600"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
      {/* Team */}
      <section className="border-y border-gray-100 bg-white py-8 sm:py-10 lg:py-12">
        <div className="container-custom">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              The People Behind BLF
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#29251F] sm:text-4xl">
              Meet Our Expert Team
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              Meet the professionals supporting our property and construction services.
            </p>
          </div>

          {teamLoading ? (
            <div className="rounded-2xl border border-gray-100 bg-[#F5F1E8] px-5 py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-amber-500" />
              <p className="mt-4 text-sm text-gray-500">Loading team members...</p>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <article
                  key={member._id || index}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-[#F5F1E8] transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:bg-white hover:shadow-[0_16px_35px_rgba(41,37,31,0.09)]"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100 sm:h-56">
                    <img
                      src={getTeamImage(member)}
                      alt={member.name || "BLF Property team member"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.src = "/image/muz1.jpg";
                        event.currentTarget.onerror = null;
                      }}
                    />

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#29251F]/60 to-transparent" />
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-xl font-bold text-[#29251F]">
                      {member.name || "Team Member"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-amber-700">
                      {member.position || "BLF Property"}
                    </p>

                    {getTeamExperience(member) && (
                      <p className="mt-3 text-sm leading-6 text-gray-500">
                        {getTeamExperience(member)}
                      </p>
                    )}

                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 break-all text-sm text-gray-600 transition hover:text-amber-700"
                        >
                          <span className="font-bold text-amber-600">E</span>
                          {member.email}
                        </a>
                      )}

                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-amber-700"
                        >
                          <span className="font-bold text-amber-600">P</span>
                          {member.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-[#F5F1E8] px-5 py-8 text-center">
              <h3 className="text-lg font-bold text-[#29251F]">
                Our team information is being updated
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Please contact us for assistance with your requirements.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative isolate overflow-hidden bg-transparent py-8 text-[#29251F] sm:py-10 lg:py-12">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
              Start Your Property Journey
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Let's find the right property
              <span className="block text-amber-400">for your next chapter.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              Tell us what you are looking for. Our team is here to help you explore your options.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-[#29251F] transition hover:bg-amber-300"
              >
                Get in Touch
                <ArrowIcon />
              </Link>

              <Link
                to="/properties"
                className="inline-flex items-center justify-center rounded-xl border border-[#29251F]/20 px-6 py-3.5 text-sm font-semibold text-[#29251F] transition hover:bg-[#29251F]/5"
              >
                Explore Properties
              </Link>
            </div>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 text-sm text-gray-600 sm:flex-row sm:gap-7">
              <a
                href="mailto:blfproperty@gmail.com"
                className="transition hover:text-amber-300"
              >
                blfproperty@gmail.com
              </a>
              <span className="hidden text-white/30 sm:inline">|</span>
              <a
                href="tel:+917033576717"
                className="transition hover:text-amber-300"
              >
                +91 7033576717
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
