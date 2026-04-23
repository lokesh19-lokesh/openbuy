import React from 'react';
import PageLayout from '../components/PageLayout';

const TermsOfService = () => (
  <PageLayout 
    title="Terms of Service" 
    subtitle="Please review the rules and guidelines for using OpenBuy."
  >
    <div className="text-sm text-gray-500 mb-10 flex justify-between">
      <span>Effective Date: April 23, 2026</span>
      <span>Version 2.1</span>
    </div>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">1. Agreement to Terms</h2>
      <p>
        By accessing or using the OpenBuy website, mobile application, or any other service provided by OpenBuy (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">2. Eligibility and Registration</h2>
      <p className="mb-4">
        You must be at least 18 years old to create an account on OpenBuy. When you register, you agree to provide accurate, current, and complete information and to keep your account credentials secure.
      </p>
      <p>
        You are responsible for all activity that occurs under your account. If you suspect any unauthorized access, you must notify OpenBuy Support immediately.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">3. Marketplace Services</h2>
      <p className="mb-4">
        OpenBuy provides a platform that connects independent merchants ("Sellers") with customers. OpenBuy does not sell the goods directly and is not a party to the transaction between the Seller and the Customer.
      </p>
      <p>
        While we vet our Sellers, we do not guarantee the quality, safety, or legality of the items advertised, the truth or accuracy of the listings, or the ability of Sellers to complete a sale.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">4. Payments and Refunds</h2>
      <p className="mb-4">
        All payments are handled through our secure payment processors. By placing an order, you authorize OpenBuy to charge your selected payment method for the total amount of your purchase, including taxes and delivery fees.
      </p>
      <p>
        Refund requests are handled on a case-by-case basis in accordance with our Refund Policy. Generally, cancellations made after a merchant has begun preparation may be subject to a fee.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">5. Prohibited Conduct</h2>
      <p className="mb-4">Users agree not to engage in any of the following prohibited activities:</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Violating any local, state, or international laws.</li>
        <li>Impersonating any person or entity or misrepresenting your affiliation.</li>
        <li>Interfering with the proper working of the Services or our security measures.</li>
        <li>Engaging in fraudulent transactions or harassing other users.</li>
      </ul>
    </section>

    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-black border-b border-gray-100 pb-2">6. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, OpenBuy shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Services or any products purchased through the platform.
      </p>
    </section>
  </PageLayout>
);

export default TermsOfService;
