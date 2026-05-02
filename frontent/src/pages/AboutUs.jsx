import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="min-h-screen bg-green-950 text-green-50">

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1
          className="text-4xl md:text-5xl font-bold text-green-200"
          data-aos="fade-up"
        >
          About Agritace
        </h1>

        <p
          className="mt-4 text-green-100 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Agritace is a smart agricultural marketplace connecting farmers and buyers,
          ensuring transparency, fair pricing, and fresh produce delivery.
        </p>
      </section>

      {/* Mission / Vision */}
      <section className="grid md:grid-cols-2 gap-6 px-6 pb-16 max-w-6xl mx-auto">

        <div
          className="bg-green-900/40 p-6 rounded-xl border border-green-800"
          data-aos="fade-right"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-3">
            Our Mission
          </h2>
          <p className="text-green-100">
            To empower farmers by removing middlemen and enabling direct access
            to buyers through technology-driven agriculture solutions.
          </p>
        </div>

        <div
          className="bg-green-900/40 p-6 rounded-xl border border-green-800"
          data-aos="fade-left"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-3">
            Our Vision
          </h2>
          <p className="text-green-100">
            A world where agriculture is transparent, profitable, and fully
            connected through digital platforms.
          </p>
        </div>

      </section>

      {/* Values */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div
          className="bg-green-900/30 p-8 rounded-xl border border-green-800"
          data-aos="zoom-in"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-4">
            Our Core Values
          </h2>

          <ul className="space-y-2 text-green-100 list-disc pl-5">
            <li>Transparency in agricultural trade</li>
            <li>Fair pricing for farmers and buyers</li>
            <li>Technology-driven agriculture solutions</li>
            <li>Supporting sustainable farming</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-20">
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition">
          Join Agritace Community
        </button>
      </section>

    </div>
  );
};

export default AboutUs;