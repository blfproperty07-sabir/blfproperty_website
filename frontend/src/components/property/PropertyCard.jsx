import React from 'react';
import { Link } from 'react-router-dom';
import { Bath, BedDouble, Images, MapPin, MoveUpRight, Ruler } from 'lucide-react';
import { formatCurrency, formatDate, formatArea, getPropertyTypeLabel } from '../../utils/formatters';
import PropertyImage from './PropertyImage';

const PropertyCard = ({ property }) => {
  const price = property.price?.amount ?? property.price;
  const location = [property.location?.city, property.location?.state].filter(Boolean).join(', ');
  const features = [
    property.features?.bedrooms > 0 && {
      icon: BedDouble,
      label: `${property.features.bedrooms} ${property.features.bedrooms === 1 ? 'bed' : 'beds'}`
    },
    property.features?.bathrooms > 0 && {
      icon: Bath,
      label: `${property.features.bathrooms} ${property.features.bathrooms === 1 ? 'bath' : 'baths'}`
    },
    property.area?.size > 0 && {
      icon: Ruler,
      label: formatArea(property.area.size, property.area.unit || 'sqft')
    }
  ].filter(Boolean);

  return (
    <Link
      to={`/properties/${property._id}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <PropertyImage
          image={property.images?.[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
            {getPropertyTypeLabel(property.type)}
          </span>
          <span className="rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            For {property.category === 'rent' ? 'Rent' : property.category === 'lease' ? 'Lease' : 'Sale'}
          </span>
        </div>
        {property.images?.length > 1 && (
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            <Images size={14} aria-hidden="true" />
            {property.images.length} photos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 min-h-12 text-lg font-bold leading-6 text-slate-900 transition-colors group-hover:text-orange-700">
            {property.title}
          </h2>
          <MoveUpRight className="mt-1 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-600" size={18} aria-hidden="true" />
        </div>

        <p className="flex min-h-5 items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={15} className="shrink-0 text-orange-500" aria-hidden="true" />
          <span className="truncate">{location || property.location?.address || 'Location not provided'}</span>
        </p>

        {features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-sm text-slate-600">
            {features.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <Icon size={16} className="text-slate-400" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {property.category === 'rent' ? 'Monthly rent' : property.category === 'lease' ? 'Lease price' : 'Asking price'}
            </p>
            <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
              {formatCurrency(price)}
              {property.category === 'rent' && <span className="ml-1 text-sm font-medium text-slate-500">/ month</span>}
            </p>
          </div>
          <span className="shrink-0 text-right text-xs text-slate-400">
            {property.createdAt ? `Listed ${formatDate(property.createdAt)}` : 'View listing'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
