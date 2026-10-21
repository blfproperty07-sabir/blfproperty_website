import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionSection = () => (
  <>
{/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Browse Properties
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
  </>
);

export default CallToActionSection;
