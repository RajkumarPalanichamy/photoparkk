import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-secondary">
      <h1 className="text-3xl font-bold mb-6 text-center text-secondary">
        Terms & Conditions
      </h1>

      <p className="mb-4">
        <strong>Effective Date:</strong> July 2, 2025
      </p>

      <p className="mb-4">
        Welcome to <strong>PhotoParkk</strong>. By accessing or using our
        website and services, you agree to be bound by the following Terms &
        Conditions. If you do not agree with any part of these terms, please do
        not use our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. About Us</h2>
      <p className="mb-4">
        PhotoParkk is a personalized photo framing service operated via{" "}
        <a href="mailto:photoparkk.prints@gmail.com" className="text-primary">
          photoparkk.prints@gmail.com
        </a>
        . We offer custom-designed photo frames based on your uploaded images
        and preferences.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Use of Our Services
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You must be at least 18 years old to place an order.</li>
        <li>All information provided must be accurate and current.</li>
        <li>
          You agree not to upload any illegal, offensive, or copyrighted images
          without permission.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Orders & Customizations
      </h2>
      <p className="mb-4">
        Once an order is placed, it cannot be modified or canceled after
        processing begins. Customization details such as frame type, size, and
        image placement are the customer’s responsibility. Please review all
        selections carefully before confirming your order.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Payment Terms</h2>
      <p className="mb-4">
        All payments must be made in full at the time of order. We use secure
        payment gateways to process transactions. Prices are subject to change
        without notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Shipping & Delivery
      </h2>
      <p className="mb-4">
        We aim to deliver your customized frames within the estimated delivery
        time. Delays may occur due to unforeseen circumstances. We are not
        responsible for delays caused by third-party courier services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Returns & Replacements
      </h2>
      <p className="mb-4">
        Since products are custom-made, returns are not accepted unless the item
        is defective or damaged during shipping. In such cases, please contact
        us with photo evidence within 48 hours of delivery.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Intellectual Property
      </h2>
      <p className="mb-4">
        All website content, designs, and product templates are the property of
        PhotoParkk. User-uploaded images remain the property of the user and are
        used only for fulfilling the specific order.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Limitation of Liability
      </h2>
      <p className="mb-4">
        PhotoParkk shall not be liable for any indirect, incidental, or
        consequential damages resulting from the use or inability to use our
        services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        9. Modifications to Terms
      </h2>
      <p className="mb-4">
        We reserve the right to modify these Terms & Conditions at any time.
        Updated terms will be posted on this page, and your continued use of the
        service implies acceptance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Contact Us</h2>
      <p className="mb-1">
        If you have any questions about these Terms, please contact us:
      </p>
      <p className="mb-1">
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

export default TermsAndConditions;
