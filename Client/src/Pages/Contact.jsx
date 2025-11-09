import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import contact from "../assets/frontend_assets/Contact/Contact-banner-image.jpg";
import { 
  FaEnvelope, 
  FaPhone, 
  FaInstagram, 
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaComments,
  FaPaperPlane,
  FaWhatsapp
} from "react-icons/fa";
import {
  CONTACT_DISPLAY_NUMBER,
  CONTACT_TEL_LINK_WITH_COUNTRY,
  CONTACT_WHATSAPP_LINK,
} from "../constants/contact";

const Contact = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${contact})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed"
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    emailjs
      .sendForm(
        "service_2udw4si",
        "template_cfs794h",
        form.current,
        "E18ixUzrdeFZEoTww"
      )
      .then(
        () => {
          setIsSent(true);
          setIsLoading(false);
          form.current.reset();
          setTimeout(() => setIsSent(false), 5000);
        },
        (err) => {
          console.error(err.text);
          setError("Failed to send message. Please try again later.");
          setIsLoading(false);
        }
      );
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: "photoparkk.prints@gmail.com",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      delay: 0.1,
      link: "mailto:photoparkk.prints@gmail.com"
    },
    {
      icon: FaPhone,
      label: "Phone",
      value: CONTACT_DISPLAY_NUMBER,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      delay: 0.2,
      link: CONTACT_TEL_LINK_WITH_COUNTRY
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      value: "@photoparkk",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      delay: 0.3,
      link: "https://instagram.com/photoparkk"
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      value: CONTACT_DISPLAY_NUMBER,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      delay: 0.35,
      link: CONTACT_WHATSAPP_LINK
    },
    {
      icon: FaMapMarkerAlt,
      label: "Address",
      value: "501, Miller bus stop, P.N.Road Tiruppur - 641 602",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      delay: 0.4,
      link: "https://maps.google.com/?q=Photo+Parkk+Tiruppur"
    }
  ];

  const stats = [
    { value: "24h", label: "Response Time", icon: FaClock },
    { value: "100%", label: "Satisfaction", icon: FaCheckCircle },
    { value: "500+", label: "Happy Clients", icon: FaComments }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Header */}
      <section 
        style={backgroundStyle}
        className="relative h-96 md:h-[500px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/20" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl mb-6"
          >
            <FaComments className="text-white text-xl" />
            <span className="text-white font-bold text-lg uppercase tracking-wider">
              Get In Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Let's Create{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Together
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            Ready to transform your memories into timeless art? We're here to help.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 -mt-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-2xl text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                >
                  Let's Start a{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Conversation
                  </span>
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-lg text-gray-600 leading-relaxed mb-8"
                >
                  Have a project in mind? We'd love to hear about it. Send us a message and we'll respond within 24 hours.
                </motion.p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.link}
                    target={item.link.startsWith('http') ? "_blank" : "_self"}
                    rel={item.link.startsWith('http') ? "noopener noreferrer" : ""}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: item.delay }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 block"
                  >
                    <div className={`p-3 rounded-2xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <item.icon className={`text-2xl bg-gradient-to-r ${item.color} text-transparent bg-clip-text`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1 text-lg">{item.label}</div>
                      <div className="text-gray-600 font-medium">{item.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20">
                <motion.form
                  ref={form}
                  onSubmit={sendEmail}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                    <p className="text-gray-600">We'll get back to you soon</p>
                  </div>

                  <AnimatePresence>
                    {isSent && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
                      >
                        <FaCheckCircle className="text-2xl text-green-600" />
                        <div>
                          <div className="font-semibold text-green-900">Message sent successfully!</div>
                          <div className="text-green-700 text-sm">We'll get back to you within 24 hours.</div>
                        </div>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3"
                      >
                        <FaComments className="text-2xl text-red-600" />
                        <div>
                          <div className="font-semibold text-red-900">Error sending message</div>
                          <div className="text-red-700 text-sm">{error}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="user_email"
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      rows="5"
                      name="message"
                      required
                      placeholder="Tell us about your project..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-lg" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Visit Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Studio
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Come see where the magic happens. Our studio is equipped with state-of-the-art technology to bring your vision to life.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20"
          >
            <iframe
              title="Google Map"
              className="w-full h-96 md:h-[500px]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.9916362002655!2d77.33937968962991!3d11.11400047244468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907ac16503cdb%3A0x89de1ccc00465422!2sPhoto%20Parkk!5e0!3m2!1sen!2sin!4v1745472636881!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;