import React from 'react';
import PageLayout from '../components/PageLayout';

const PrivacyPolicy = () => (
  <PageLayout 
    title="Privacy Policy" 
    subtitle="We value your privacy and are committed to protecting your personal data."
  >
    <div className="text-sm text-gray-500 mb-10">
      <span>Effective Date: April 23, 2026</span>
    </div>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">1. Introduction</h2>
      <p>
        OpenBuy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share your personal information when you use our website and mobile application.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">2. Information We Collect</h2>
      <p className="mb-4">We collect information that you provide directly to us, including:</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li><strong>Account Information:</strong> Name, email address, phone number, and password.</li>
        <li><strong>Transaction Information:</strong> Details about the products you buy and payment details (processed securely).</li>
        <li><strong>Location Information:</strong> Precise location data to facilitate delivery tracking.</li>
        <li><strong>Communication Data:</strong> Records of your interactions with our support team.</li>
      </ul>
      <p>We also collect information automatically, such as IP addresses, device identifiers, and browsing activity using cookies and similar technologies.</p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">3. How We Use Your Information</h2>
      <p className="mb-4">We use the collected information to:</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Provide, maintain, and improve our Services.</li>
        <li>Process transactions and send related information (confirmations, receipts).</li>
        <li>Coordinate with delivery partners and merchants to fulfill your orders.</li>
        <li>Detect, investigate, and prevent fraudulent activity.</li>
        <li>Communicate with you about products, services, and promotions.</li>
      </ul>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">4. Data Sharing</h2>
      <p className="mb-4">We may share your information with:</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li><strong>Merchants:</strong> To fulfill your orders and handle returns.</li>
        <li><strong>Delivery Partners:</strong> To ensure your items reach you accurately.</li>
        <li><strong>Service Providers:</strong> Who perform services on our behalf (e.g., payment processing).</li>
        <li><strong>Legal Authorities:</strong> If required to do so by law or in response to a valid legal request.</li>
      </ul>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or theft. However, no method of transmission over the internet is 100% secure.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">6. Your Choices</h2>
      <p>
        You can access and update your account information through your profile settings. You may also opt-out of receiving promotional communications from us by following the instructions in those messages.
      </p>
    </section>
  </PageLayout>
);

export default PrivacyPolicy;
