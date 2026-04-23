import React from 'react';
import PageLayout from '../components/PageLayout';

const Careers = () => (
  <PageLayout 
    title="Careers" 
    subtitle="Join us in redefining the future of instant local commerce."
  >
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black tracking-tight">Why Join OpenBuy?</h2>
      <p className="mb-6">
        We are a fast-growing team of innovators, engineers, and creatives who are passionate about building technology that has a real-world impact. At OpenBuy, you'll have the opportunity to work on complex problems, from real-time logistics optimization to high-scale marketplace infrastructure.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-black mb-2">High Impact</h3>
          <p className="text-sm text-gray-600">Your work directly empowers local businesses and touches the lives of millions of customers.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-black mb-2">Fast Growth</h3>
          <p className="text-sm text-gray-600">We are scaling rapidly, offering unique opportunities for career growth and leadership.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-black mb-2">Innovative Tech</h3>
          <p className="text-sm text-gray-600">Work with the latest technologies in a high-velocity, engineering-driven environment.</p>
        </div>
      </div>
    </section>

    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black tracking-tight">Our Benefits</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
        <li className="flex items-start">
          <div className="mr-3 mt-1 bg-black text-white rounded-full p-1 text-[10px]">✓</div>
          <div>
            <span className="font-bold text-black">Competitive Compensation</span>
            <p className="text-sm text-gray-500">Industry-leading salary and equity packages.</p>
          </div>
        </li>
        <li className="flex items-start">
          <div className="mr-3 mt-1 bg-black text-white rounded-full p-1 text-[10px]">✓</div>
          <div>
            <span className="font-bold text-black">Flexible Remote Work</span>
            <p className="text-sm text-gray-500">Work from anywhere or from our modern hub offices.</p>
          </div>
        </li>
        <li className="flex items-start">
          <div className="mr-3 mt-1 bg-black text-white rounded-full p-1 text-[10px]">✓</div>
          <div>
            <span className="font-bold text-black">Health & Wellness</span>
            <p className="text-sm text-gray-500">Comprehensive health, dental, and vision insurance.</p>
          </div>
        </li>
        <li className="flex items-start">
          <div className="mr-3 mt-1 bg-black text-white rounded-full p-1 text-[10px]">✓</div>
          <div>
            <span className="font-bold text-black">Learning Stipend</span>
            <p className="text-sm text-gray-500">Annual budget for books, courses, and conferences.</p>
          </div>
        </li>
      </ul>
    </section>

    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-black tracking-tight">Open Positions</h2>
      <div className="space-y-4">
        {[
          { title: "Senior Backend Engineer", team: "Core Infrastructure", location: "Remote / NY" },
          { title: "Product Designer", team: "Consumer Experience", location: "Remote / SF" },
          { title: "Operations Manager", team: "Logistics", location: "Chicago, IL" },
          { title: "Data Scientist", team: "Marketplace Optimization", location: "Remote" },
          { title: "Frontend Developer (React)", team: "Merchant Tools", location: "Remote / NY" }
        ].map((job, idx) => (
          <div key={idx} className="group p-6 border border-gray-200 rounded-2xl hover:border-black transition-all duration-300 cursor-pointer bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xl text-black group-hover:text-black transition-colors">{job.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{job.team} • {job.location}</p>
              </div>
              <div className="text-black font-bold group-hover:translate-x-2 transition-transform">&rarr;</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </PageLayout>
);

export default Careers;
