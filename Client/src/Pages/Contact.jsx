import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  FaWhatsapp,
} from "react-icons/fa";
import {
  CONTACT_DISPLAY_NUMBER,
  CONTACT_TEL_LINK_WITH_COUNTRY,
  CONTACT_WHATSAPP_LINK,
} from "../constants/contact";

// Zod schema for form validation
const contactFormSchema = z.object({
  user_name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters")
    .trim(),
  user_email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email address is too long")
    .refine(
      (email) => {
        const parts = email.split("@");
        if (parts.length !== 2) return false;
        const [localPart, domain] = parts;
        if (localPart.length > 64) return false;
        if (!domain || domain.length === 0) return false;
        const domainRegex =
          /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        return domainRegex.test(domain);
      },
      {
        message: "Invalid email domain format",
      }
    ),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long (maximum 2000 characters)")
    .trim(),
});

const Contact = () => {
  const form = useRef(null);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit", // Only validate on submit
    reValidateMode: "onSubmit", // Re-validate only on submit
  });

  // Watch message field for character counter
  const messageValue = watch("message") || "";
  const messageLength = messageValue.length;

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${contact})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  // Form submission handler
  const onSubmit = async () => {
    setError("");

    if (!form.current) {
      setError("Form reference is missing. Please refresh the page.");
      return;
    }

    try {
      await emailjs.sendForm(
        "service_2udw4si",
        "template_cfs794h",
        form.current,
        "E18ixUzrdeFZEoTww"
      );

      setIsSent(true);
      reset(); // Reset form using react-hook-form
      setTimeout(() => setIsSent(false), 5000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send message. Please try again later.");
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: "photoparkk.prints@gmail.com",
      color: "from-primary to-primary-dark",
      bgColor: "bg-primary-light",
      delay: 0.1,
      link: "mailto:photoparkk.prints@gmail.com",
    },
    {
      icon: FaPhone,
      label: "Phone",
      value: CONTACT_DISPLAY_NUMBER,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-success-light",
      delay: 0.2,
      link: CONTACT_TEL_LINK_WITH_COUNTRY,
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      value: "@photoparkk",
      color: "from-primary to-primary-dark",
      bgColor: "bg-primary",
      delay: 0.3,
      link: "https://instagram.com/photoparkk",
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      value: CONTACT_DISPLAY_NUMBER,
      color: "from-green-500 to-green-600",
      bgColor: "bg-success-light",
      delay: 0.35,
      link: CONTACT_WHATSAPP_LINK,
    },
    {
      icon: FaMapMarkerAlt,
      label: "Address",
      value: "501, Miller bus stop, P.N.Road Tiruppur - 641 602",
      color: "from-primary to-primary-dark",
      bgColor: "bg-primary-light",
      delay: 0.4,
      link: "https://maps.google.com/?q=Photo+Parkk+Tiruppur",
    },
  ];

  const stats = [
    { value: "24h", label: "Response Time", icon: FaClock },
    { value: "100%", label: "Satisfaction", icon: FaCheckCircle },
    { value: "500+", label: "Happy Clients", icon: FaComments },
  ];

  return (
    <div className="bg-neutral-50">
      {/* Hero Header */}
      <section
        style={backgroundStyle}
        className="relative h-96 md:h-[500px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-secondary/30 to-secondary/20" />
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
            <span className="text-primary">
              Together
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            Ready to transform your memories into timeless art? We're here to
            help.
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-2xl text-white" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
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
                  className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight"
                >
                  Let's Start a{" "}
                  <span className="text-primary">
                    Conversation
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-lg text-neutral-600 leading-relaxed mb-8"
                >
                  Have a project in mind? We'd love to hear about it. Send us a
                  message and we'll respond within 24 hours.
                </motion.p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : "_self"}
                    rel={
                      item.link.startsWith("http") ? "noopener noreferrer" : ""
                    }
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: item.delay }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 block"
                  >
                    <div
                      className={`p-3 rounded-2xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    >
                      <item.icon
                        className={`text-2xl text-primary`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-secondary mb-1 text-lg">
                        {item.label}
                      </div>
                      <div className="text-neutral-600 font-medium">
                        {item.value}
                      </div>
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
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-secondary mb-2">
                      Send us a Message
                    </h3>
                    <p className="text-neutral-600">We'll get back to you soon</p>
                  </div>

                  <AnimatePresence>
                    {isSent && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-primary border border-success rounded-2xl p-4 flex items-center gap-3"
                      >
                        <FaCheckCircle className="text-2xl text-success" />
                        <div>
                          <div className="font-semibold text-success">
                            Message sent successfully!
                          </div>
                          <div className="text-success text-sm">
                            We'll get back to you within 24 hours.
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-primary border border-red-200 rounded-2xl p-4 flex items-center gap-3"
                      >
                        <FaComments className="text-2xl text-error" />
                        <div>
                          <div className="font-semibold text-red-900">
                            Error sending message
                          </div>
                          <div className="text-error text-sm">{error}</div>
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
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      {...register("user_name")}
                      className={`w-full px-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.user_name
                          ? "border-error focus:ring-red-500"
                          : "border-neutral-200 focus:ring-primary-light focus:border-transparent"
                      }`}
                    />
                    {errors.user_name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-error text-sm mt-1"
                      >
                        {errors.user_name.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      {...register("user_email")}
                      className={`w-full px-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.user_email
                          ? "border-error focus:ring-red-500"
                          : "border-neutral-200 focus:ring-primary-light focus:border-transparent"
                      }`}
                    />
                    {errors.user_email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-error text-sm mt-1"
                      >
                        {errors.user_email.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="5"
                      placeholder="Tell us about your project..."
                      maxLength={2000}
                      {...register("message")}
                      className={`w-full px-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                        errors.message
                          ? "border-error focus:ring-red-500"
                          : "border-neutral-200 focus:ring-primary-light focus:border-transparent"
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.message ? (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-error text-sm"
                        >
                          {errors.message.message}
                        </motion.p>
                      ) : (
                        <div></div>
                      )}
                      <span
                        className={`text-xs ${
                          messageLength > 2000
                            ? "text-red-500"
                            : messageLength > 1800
                            ? "text-warning"
                            : "text-neutral-500"
                        }`}
                      >
                        {messageLength}/2000 characters
                      </span>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
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
              className="text-4xl md:text-5xl font-bold text-secondary mb-4"
            >
              Visit Our{" "}
              <span className="text-primary">
                Studio
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
            >
              Come see where the magic happens. Our studio is equipped with
              state-of-the-art technology to bring your vision to life.
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
