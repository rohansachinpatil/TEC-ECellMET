import { useState } from 'react';

import { motion } from 'framer-motion';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert("Message received! We'll get back to you soon.");
      setFormData({ name: '', email: '', query: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="relative min-h-screen bg-deep-black py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-orbitron text-4xl font-bold text-white sm:text-5xl md:text-7xl">
            <span className="text-f1-red">Contact</span> Mission Control
          </h2>
          <p className="px-4 font-inter text-lg text-white/70 md:text-xl">
            Send us your telemetry data
          </p>
        </motion.div>

        {/* Telemetry-Style Form */}
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-morphism rounded-2xl border border-f1-red/20 p-8 md:p-12"
        >
          {/* Form Header */}
          <div className="mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-f1-red" />
                <span className="font-orbitron text-sm uppercase tracking-wider text-f1-red">
                  Transmission Active
                </span>
              </div>
              <div className="font-mono text-xs text-white/40">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="mb-2 block font-orbitron text-sm uppercase tracking-wide text-white/70"
            >
              Pilot Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 font-inter text-white transition-all focus:border-f1-red focus:outline-none focus:ring-1 focus:ring-f1-red"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block font-orbitron text-sm uppercase tracking-wide text-white/70"
            >
              Communication Channel
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 font-inter text-white transition-all focus:border-f1-red focus:outline-none focus:ring-1 focus:ring-f1-red"
              placeholder="your.email@domain.com"
            />
          </div>

          {/* Query Field */}
          <div className="mb-8">
            <label
              htmlFor="query"
              className="mb-2 block font-orbitron text-sm uppercase tracking-wide text-white/70"
            >
              Message Data
            </label>
            <textarea
              id="query"
              name="query"
              value={formData.query}
              onChange={handleChange}
              required
              rows={5}
              className="w-full resize-none rounded-lg border border-white/20 bg-black/50 px-4 py-3 font-inter text-white transition-all focus:border-f1-red focus:outline-none focus:ring-1 focus:ring-f1-red"
              placeholder="Enter your query or message..."
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full rounded-lg bg-f1-red px-8 py-4 font-orbitron text-lg font-bold uppercase tracking-wider shadow-red-glow transition-all duration-300 hover:shadow-red-glow-strong ${
              isSubmitting ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isSubmitting ? 'Transmitting...' : 'Send Transmission'}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
