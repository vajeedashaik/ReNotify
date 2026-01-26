import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - ReNotify',
  description: 'ReNotify terms of service. Rules and guidelines for using our platform.',
};

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p className="text-gray-500 mb-10">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using ReNotify (&quot;the Service&quot;), you agree to be
              bound by these Terms of Service. If you do not agree, please do
              not use the Service. We may update these terms from time to time;
              continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Description of Service
            </h2>
            <p>
              ReNotify provides a platform for managing warranties, AMCs, and
              service reminders. Admin users can upload datasets, manage
              customers, and track products. Customer users can view their
              products, warranties, and receive reminders. We strive to keep the
              Service available but do not guarantee uninterrupted access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. User Accounts & Responsibilities
            </h2>
            <p className="mb-3">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activity under your account. You
              agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information when registering.</li>
              <li>Use the Service only for lawful purposes.</li>
              <li>Not misuse, disrupt, or attempt to gain unauthorized access to the Service or its systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Data & Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </Link>
              . You must ensure that any data you upload or provide (including
              customer data) is done with appropriate consent and in compliance
              with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Intellectual Property
            </h2>
            <p>
              ReNotify, including its design, branding, and software, is owned by
              us or our licensors. You may not copy, modify, or create derivative
              works without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, ReNotify and its operators
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the Service. Our
              total liability shall not exceed the amount you paid us, if any, in
              the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Termination
            </h2>
            <p>
              We may suspend or terminate your access to the Service at any time
              for violation of these terms or for any other reason. You may stop
              using the Service at any time. Upon termination, your right to use
              the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Contact
            </h2>
            <p>
              For questions about these Terms of Service, please contact us
              through the contact information provided on our website or within
              the ReNotify platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
