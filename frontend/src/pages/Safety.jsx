import React from 'react';
import PageLayout from '../components/PageLayout';

const Safety = () => (
  <PageLayout 
    title="Trust & Safety" 
    subtitle="Your security and peace of mind are our top priority."
  >
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black tracking-tight">Our Commitment</h2>
      <p className="mb-6">
        At OpenBuy, we believe that a safe marketplace is a successful one. We invest heavily in technology and operations to ensure that every interaction on our platform is secure, transparent, and respectful.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            All transactions are processed through encrypted, PCI-compliant payment gateways. We never store your full card details on our servers, ensuring your financial information remains private.
          </p>
        </div>
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <h3 className="text-xl font-bold mb-3">Verified Partners</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every merchant and delivery partner undergoes a multi-step verification process, including identity checks and business license validation, before they can join the OpenBuy network.
          </p>
        </div>
      </div>
    </section>

    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black tracking-tight">Data Protection</h2>
      <p className="mb-6">
        We utilize industry-standard encryption and security protocols to protect your personal data. From the moment you sign up to the moment your order is delivered, your information is shielded from unauthorized access.
      </p>
      <ul className="space-y-4 list-none pl-0">
        {[
          "End-to-end encryption for all sensitive data transmission",
          "Regular security audits by independent third-party firms",
          "Real-time fraud detection and prevention systems",
          "Strict internal access controls to user information"
        ].map((item, idx) => (
          <li key={idx} className="flex items-center text-gray-700">
            <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
            {item}
          </li>
        ))}
      </ul>
    </section>

    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black tracking-tight">Reporting Issues</h2>
      <p className="mb-6">
        If you encounter any suspicious activity, harassment, or have a safety concern, please report it immediately. Our dedicated safety team reviews all reports within 24 hours and takes appropriate action, which may include permanent account suspension.
      </p>
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start">
        <div className="text-2xl mr-4">🛡️</div>
        <div>
          <h4 className="font-bold text-red-900">Emergency Support</h4>
          <p className="text-sm text-red-800">If you are in immediate danger or have a medical emergency, please contact your local emergency services (e.g., 911) before contacting OpenBuy.</p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Safety;
