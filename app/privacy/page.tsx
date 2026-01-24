import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - ReNotify',
  description: 'ReNotify privacy policy. How we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-500 mb-10">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p>
              Welcome to ReNotify. We are committed to protecting your personal
              information and your right to privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you use our warranty, AMC, and service reminder management
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account data:</strong> Email addresses (admins), mobile
                numbers (customers), and credentials used to access our
                services.
              </li>
              <li>
                <strong>Purchase & warranty data:</strong> Product details,
                purchase dates, warranty and AMC information, and service
                center details you or your retailer provide.
              </li>
              <li>
                <strong>Usage data:</strong> How you interact with our platform,
                including login activity and feature usage.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. How We Use Your Information
            </h2>
            <p>
              We use your information to operate and improve ReNotify, including
              sending warranty and service reminders, managing your products and
              alerts, providing customer support, and ensuring the security of
              our services. We do not sell your personal information to third
              parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Data Sharing & Disclosure
            </h2>
            <p>
              We may share your information only with trusted service providers
              who assist us in operating our platform (e.g., hosting, analytics),
              and when required by law. We require these parties to protect your
              data in line with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Your Rights
            </h2>
            <p>
              Depending on your location, you may have the right to access,
              correct, or delete your personal data, or to object to or restrict
              certain processing. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our practices,
              please contact us through the contact information provided on our
              website or within the ReNotify platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
