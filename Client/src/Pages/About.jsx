import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Factory, Shield, Zap, CheckCircle, Award } from "lucide-react";
import machine1 from "../assets/frontend_assets/About/machine1.jpg";
import machine2 from "../assets/frontend_assets/About/machine2.jpg";
import machine3 from "../assets/frontend_assets/About/machine3.jpg";
import machine4 from "../assets/frontend_assets/About/machine4.jpg";
import machine5 from "../assets/frontend_assets/About/machine5.jpg";
import AboutVideo from "../assets/frontend_assets/HomeSlides/photoparkk Video.mp4";

const SlideInText = ({ children, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
    className="inline-block"
  >
    {children}
  </motion.span>
);

const ImageCard = ({ src, alt, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, delay }}
      className="relative group overflow-hidden rounded-3xl"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const About = () => {
  const features = [
    { icon: Zap, label: "Precision Cutting", value: "0.1mm Accuracy" },
    { icon: Shield, label: "Quality Assurance", value: "100% Tested" },
    { icon: Factory, label: "Production Capacity", value: "500+ Daily" },
    { icon: Award, label: "Industry Experience", value: "25+ Years" },
  ];

  const processSteps = [
    {
      image: machine2,
      title: "Precision Engineering",
      description:
        "Our state-of-the-art CNC machines deliver micron-level accuracy in every cut. Advanced laser guidance ensures perfect alignment and flawless execution for premium frame construction.",
      features: [
        "CNC Precision Cutting",
        "Laser Guided Alignment",
        "Digital Calibration",
        "Quality Monitoring",
      ],
      icon: Zap,
    },
    {
      image: machine4,
      title: "Automated Assembly",
      description:
        "Robotic assembly lines ensure consistent quality and rapid production. Each frame undergoes 12-point verification during the assembly process for perfect results every time.",
      features: [
        "Robotic Assembly",
        "12-Point Verification",
        "Automated Quality Control",
        "Real-time Monitoring",
      ],
      icon: Factory,
    },
    {
      image: machine3,
      title: "Quality Inspection",
      description:
        "Every product passes through our rigorous 25-point inspection protocol. Advanced imaging systems detect imperfections invisible to the naked eye.",
      features: [
        "25-Point Inspection",
        "Digital Imaging",
        "Stress Testing",
        "Finish Verification",
      ],
      icon: Shield,
    },
    {
      image: machine1,
      title: "Advanced Finishing",
      description:
        "Patented finishing technology creates durable, museum-quality surfaces. UV-resistant coatings ensure your frames maintain their brilliance for generations.",
      features: [
        "UV-Resistant Coating",
        "Scratch Protection",
        "Climate Stability",
        "Lifetime Finish",
      ],
      icon: Award,
    },
    {
      image: machine5,
      title: "Final Certification",
      description:
        "Each frame receives our gold-standard certification after passing all quality benchmarks. Your satisfaction is guaranteed with our comprehensive warranty.",
      features: [
        "Gold Standard Certified",
        "Quality Benchmark",
        "Comprehensive Warranty",
        "Customer Satisfaction",
      ],
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 font-[poppins]">
      {/* Hero Video Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={AboutVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Darker overlays for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/60 to-gray-900/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black/70" />
          {/* Additional dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-6xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl mb-8"
            >
              <Factory className="text-white" size={24} />
              <span className="text-white font-bold text-lg uppercase tracking-wider">
                Manufacturing Excellence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            >
              <SlideInText delay={0.5}>Advanced</SlideInText>
              <br />
              <SlideInText delay={0.7}>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Machinery
                </span>
              </SlideInText>
              <br />
              <SlideInText delay={0.9}>In Action</SlideInText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Witness our state-of-the-art production process delivering
              precision-crafted frames with unmatched quality and attention to
              detail.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {processSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`mb-32 last:mb-0 ${
              index % 2 === 0 ? "" : "md:flex-row-reverse"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Step Number */}
                  <div className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    0{index + 1}
                  </div>
                </div>

                {/* Floating Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -right-6 w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center border border-gray-100"
                >
                  <step.icon className="w-10 h-10 text-blue-600" />
                </motion.div>
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-2xl border border-blue-100">
                  <step.icon className="w-6 h-6 text-blue-600" />
                  <span className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
                    Step {index + 1}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  {step.title}
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + featureIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 text-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl mx-4 md:mx-8 lg:mx-16 mb-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl mb-8"
        >
          <Award className="text-white" size={24} />
          <span className="text-white font-bold text-lg uppercase tracking-wider">
            Ready to Experience Quality?
          </span>
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Let's Create Something{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Amazing
          </span>
        </h2>

        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
          Join thousands of satisfied customers who trust our precision-crafted
          frames for their most precious memories.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
          >
            Start Your Project
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
          >
            View Our Work
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
