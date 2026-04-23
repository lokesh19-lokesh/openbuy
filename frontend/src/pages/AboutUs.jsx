import React from 'react';
import PageLayout from '../components/PageLayout';

const AboutUs = () => (
  <PageLayout 
    title="About Us" 
    subtitle="We are on a mission to bring local goods to your doorstep, instantly."
  >
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black tracking-tight">Our Story</h2>
      <p className="mb-6">
        Founded in 2026, OpenBuy was born out of a simple observation: the digital world moves at the speed of light, but physical delivery often lags behind. We saw an opportunity to bridge this gap by empowering local merchants with the same technological advantages as global giants.
      </p>
      <p>
        What started as a small pilot program in a single neighborhood has rapidly evolved into a robust marketplace. Today, OpenBuy connects thousands of verified local sellers with millions of customers, proving that "local" can be just as fast and reliable as "global."
      </p>
    </section>

    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black tracking-tight">Our Mission</h2>
      <p className="mb-6">
        Our mission is to build the world's most efficient local commerce infrastructure. We believe that by providing merchants with cutting-edge tools and a seamless logistics network, we can revitalize local economies and provide consumers with an unparalleled shopping experience.
      </p>
      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
        <p className="text-2xl italic text-black font-medium leading-relaxed">
          "We don't just deliver packages; we deliver opportunities for local businesses to thrive in a digital-first world."
        </p>
        <p className="mt-4 font-bold">— The OpenBuy Leadership Team</p>
      </div>
    </section>

    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black tracking-tight">Our Core Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-2">Customer Obsession</h3>
          <p className="text-sm text-gray-600">Everything we build starts with the customer. If it doesn't make their life easier or faster, we don't build it.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Empower Local</h3>
          <p className="text-sm text-gray-600">We are advocates for local business. Our success is measured by the growth of our merchant partners.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Radical Transparency</h3>
          <p className="text-sm text-gray-600">From our pricing to our tracking, we believe in being open and honest with our users and partners.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Speed as a Feature</h3>
          <p className="text-sm text-gray-600">In our world, speed isn't just a metric; it's a core component of our product identity.</p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default AboutUs;
