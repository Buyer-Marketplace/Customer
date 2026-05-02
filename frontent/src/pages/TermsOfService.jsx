import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const TermsOfService = () => {
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
          Terms of Service
        </h1>
        <p className="mt-3 text-green-100 max-w-2xl mx-auto">
          These terms govern your use of the Agritace platform. By using our services,
          you agree to comply with these conditions.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-right"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-green-100">
            By accessing or using Agritace, you agree to be bound by these Terms of Service
            and all applicable laws and regulations.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-left"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            2. Use of the Platform
          </h2>
          <p className="text-green-100">
            Agritace provides a marketplace connecting farmers and buyers. You agree to
            use the platform only for lawful purposes and not to misuse its services.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-right"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            3. User Accounts
          </h2>
          <p className="text-green-100">
            You are responsible for maintaining the confidentiality of your account
            credentials and for all activities under your account.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-left"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            4. Transactions
          </h2>
          <p className="text-green-100">
            All transactions between buyers and farmers are subject to availability,
            pricing accuracy, and agreed terms at the time of purchase.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="zoom-in"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            5. Limitations of Liability
          </h2>
          <p className="text-green-100">
            Agritace is not liable for indirect damages or disputes arising between
            users on the platform.
          </p>
        </section>

        <section
          className="bg-green-900/30 border border-green-800 p-6 rounded-xl"
          data-aos="fade-up"
        >
          <h2 className="text-2xl font-semibold text-green-200 mb-2">
            6. Changes to Terms
          </h2>
          <p className="text-green-100">
            We may update these Terms of Service from time to time. Continued use of
            Agritace means you accept any changes.
          </p>
        </section>

        <div className="text-center text-green-200 mt-10" data-aos="fade-up">
          <p>Last updated: 2026</p>
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;
