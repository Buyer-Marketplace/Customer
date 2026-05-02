import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const PrivacyPolicy = () => {
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
    <div className="min-h-screen bg-green-950 text-green-50 px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl md:text-5xl font-bold text-green-200">
          Privacy Policy
        </h1>
        <p className="mt-3 text-green-100 max-w-2xl mx-auto">
          Your privacy matters to Agritace. This policy explains how we collect,
          use, and protect your information.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-right"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            1. Information We Collect
          </h2>
          <p className="text-green-100">
            We collect basic user information such as name, email, phone number,
            and location to enable marketplace functionality and improve user experience.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-left"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            2. How We Use Your Data
          </h2>
          <p className="text-green-100">
            Your data is used to connect farmers and buyers, process orders,
            improve platform services, and ensure secure transactions.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-right"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            3. Data Protection
          </h2>
          <p className="text-green-100">
            We use secure systems and encryption practices to protect your data
            from unauthorized access, loss, or misuse.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-left"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            4. Sharing of Information
          </h2>
          <p className="text-green-100">
            We do not sell your personal data. Information is only shared with
            trusted services required to operate the Agritace platform.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="zoom-in"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            5. Your Rights
          </h2>
          <p className="text-green-100">
            You have the right to access, update, or request deletion of your personal data
            at any time through your account settings.
          </p>
        </section>

        <div className="text-center text-green-200 mt-10" data-aos="fade-up">
          <p>Last updated: 2026</p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
