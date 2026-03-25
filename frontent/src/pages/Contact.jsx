import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoArrowBack } from 'react-icons/io5';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Section */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Contact Us</h1>
            <p className="text-sm sm:text-base md:text-lg text-green-200 max-w-2xl px-4">
              Have a question or feedback? Send us a message!
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container-custom px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8" data-aos="fade-right">
        <Link
          to="/"
          className="inline-flex items-center text-xs sm:text-sm md:text-base text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-green-400/20"
        >
          <IoArrowBack className="mr-1 sm:mr-2" size={14} />
          Home
        </Link>
      </div>

      {/* Contact Form */}
      <div className="container-custom px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
        <div
          className="max-w-2xl mx-auto bg-green-900/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-green-400/20"
          data-aos="fade-up"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col text-green-200 text-sm sm:text-base">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="mt-1 p-2 rounded-lg bg-green-800/50 border border-green-400/30 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </label>

            <label className="flex flex-col text-green-200 text-sm sm:text-base">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="mt-1 p-2 rounded-lg bg-green-800/50 border border-green-400/30 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </label>

            <label className="flex flex-col text-green-200 text-sm sm:text-base">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows={5}
                className="mt-1 p-2 rounded-lg bg-green-800/50 border border-green-400/30 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </label>

            <Button
              type="submit"
              variant="primary"
              className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-4 py-2"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;