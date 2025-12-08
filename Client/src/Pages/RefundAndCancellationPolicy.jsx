import React from "react";

const RefundAndCancellationPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-secondary">
      <h1 className="text-3xl font-bold mb-6 text-center text-secondary">
        Refund & Cancellation Policy
      </h1>

      <p className="mb-4">
        <strong>Effective Date:</strong> July 2, 2025
      </p>

      <p className="mb-4">
        At <strong>PhotoParkk</strong>, we take pride in delivering high-quality
        customized photo frames. Since each product is uniquely made based on
        your submitted images and specifications, our Refund and Cancellation
        Policy is outlined below.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Order Cancellation</h2>
      <p className="mb-4">
        • Orders can only be cancelled within <strong>2 hours</strong> of
        placing the order, provided production has not started.
        <br />
        • Once processing begins (image printing, cutting, framing), the order
        cannot be cancelled or changed.
        <br />• To request cancellation, email us immediately at{" "}
        <a href="mailto:photoparkk.prints@gmail.com" className="text-primary">
          photoparkk.prints@gmail.com
        </a>{" "}
        with your order number.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Refund Policy</h2>
      <p className="mb-4">
        • Due to the customized nature of our products, we do{" "}
        <strong>not offer refunds</strong> for change of mind, incorrect size
        selection, or uploaded photo issues.
        <br />• Refunds are only issued if the item is damaged during delivery
        or there is a manufacturing defect.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Damaged or Defective Products
      </h2>
      <p className="mb-4">
        If your product arrives damaged or defective:
        <ul className="list-disc ml-6 mt-2">
          <li>
            Notify us within <strong>48 hours</strong> of receiving the order.
          </li>
          <li>
            Email us at{" "}
            <a
              href="mailto:photoparkk.prints@gmail.com"
              className="text-primary"
            >
              photoparkk.prints@gmail.com
            </a>{" "}
            with clear photos of the damaged item and packaging.
          </li>
          <li>
            Once verified, we will offer a free replacement or refund depending
            on the issue.
          </li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Replacement Conditions
      </h2>
      <p className="mb-4">
        • We will replace your frame only if the damage was caused during
        shipping or a clear production defect occurred.
        <br />• No replacements will be made for user-uploaded image quality
        issues or if damage occurs after delivery due to mishandling.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact Us</h2>
      <p className="mb-4">
        If you have questions or need to initiate a return/cancellation request,
        reach out to us at:
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

export default RefundAndCancellationPolicy;
