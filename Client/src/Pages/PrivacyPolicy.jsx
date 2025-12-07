import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-secondary">
      <h1 className="text-3xl font-bold mb-6 text-center text-secondary">
        Privacy Policy
      </h1>

      <p className="mb-4">
        <strong>Effective Date:</strong> July 2, 2025
      </p>

      <p className="mb-4">
        At <strong>PhotoParkk</strong> (
        <a href="mailto:photoparkk.prints@gmail.com" className="text-primary">
          photoparkk.prints@gmail.com
        </a>
        ), we are committed to protecting your privacy. This Privacy Policy
        explains how we collect, use, and protect your personal information when
        you use our services or visit our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>Personal Information:</strong> Name, email address, phone
          number, delivery address.
        </li>
        <li>
          <strong>Order Information:</strong> Photo uploads, frame preferences,
          customizations, transaction details.
        </li>
        <li>
          <strong>Technical Data:</strong> Device type, browser, IP address, and
          usage data (via cookies).
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To process and deliver your photo frame orders.</li>
        <li>To send order updates and respond to customer support requests.</li>
        <li>To personalize and improve our services and user experience.</li>
        <li>
          To prevent fraud, comply with legal obligations, and ensure platform
          security.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Sharing Your Information
      </h2>
      <p className="mb-4">
        We do not sell or rent your personal data. We may share your information
        with trusted partners only for the purpose of fulfilling orders (e.g.,
        delivery providers, payment gateways).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Image Usage Policy</h2>
      <p className="mb-4">
        All images uploaded by users are used solely for the purpose of creating
        and delivering personalized photo frames. We do not use or share your
        images for marketing or any third-party purposes without explicit
        consent.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
      <p className="mb-4">
        We use secure technologies and best practices to protect your data from
        unauthorized access, alteration, or loss. All sensitive transactions are
        encrypted and processed through secure payment gateways.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies</h2>
      <p className="mb-4">
        We use cookies to enhance your browsing experience and analyze website
        performance. You can manage cookie settings through your browser.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Your Rights</h2>
      <p className="mb-4">
        You have the right to request access to, correction of, or deletion of
        your personal data. To make a request, contact us at{" "}
        <a href="mailto:photoparkk.prints@gmail.com" className="text-primary">
          photoparkk.prints@gmail.com
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Updates to This Policy
      </h2>
      <p className="mb-4">
        We may update this policy from time to time. All updates will be posted
        on this page with a revised effective date.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        9. Contact Information
      </h2>
      <p className="mb-4">
        If you have questions or concerns about our Privacy Policy, contact us:
      </p>
      <p>
        <strong>PhotoParkk</strong>
      </p>
      <p>
        Email:{" "}
        <a href="mailto:photoparkk.prints@gmail.com" className="text-primary">
          photoparkk.prints@gmail.com
        </a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
