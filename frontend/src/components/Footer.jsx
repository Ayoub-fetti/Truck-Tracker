import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-semibold">Truck Tracker</span>
            </div>
            <p className="text-gray-400 text-sm">
              Efficient fleet management and tracking solution for modern logistics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/trucks" className="text-gray-400 hover:text-white transition-colors">Fleet</a></li>
              <li><a href="/trips" className="text-gray-400 hover:text-white transition-colors">Trips</a></li>
              <li><a href="/maintenance" className="text-gray-400 hover:text-white transition-colors">Maintenance</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 support@trucktracker.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Fleet St, Transport City</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Truck Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
