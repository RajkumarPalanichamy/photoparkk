"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What materials are used in your frames?",
    answer:
      "We use high-quality acrylic, canvas, and wooden materials to ensure durability and aesthetic appeal.",
  },
  {
    question: "Can I customize the size of the frame?",
    answer:
      "Yes, you can choose from preset sizes or enter custom dimensions while placing your order.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually processed within 2–3 business days and delivered within 5–7 business days.",
  },
  {
    question: "Do you offer returns or exchanges?",
    answer:
      "Yes, we offer a 7-day return/exchange window for any damaged or defective products.",
  },
  {
    question: "How do I mount the frame?",
    answer:
      "Each frame comes with mounting hardware and instructions. Installation is straightforward and typically requires basic tools.",
  },
  {
    question: "Is the backlight adjustable?",
    answer:
      "Currently, the backlight brightness is fixed, designed to provide optimal illumination for the artwork. We are exploring options for adjustable brightness in future models.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
      {/* FAQ Section */}
      <div className="w-full">
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-600 text-lg">
            Get answers to common questions about our products and services
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-primary shadow-lg"
                  : "border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md"
              }`}
            >
              <button
                onClick={() => toggleAnswer(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <h3 className="text-lg font-semibold text-secondary pr-4 group-hover:text-primary transition-colors">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <p className="text-neutral-600 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
