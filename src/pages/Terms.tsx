
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  const { t } = useTranslation();
  
  // Track page view
  usePageViewTracking('/terms', 'Terms of Service');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <FileText className="h-8 w-8 text-book-700" />
              <h1 className="text-3xl font-serif font-bold">Terms of Service</h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>Last Updated: May 19, 2025</p>
              
              <p>
                Welcome to BookBites. These Terms of Service ("Terms") govern your use of the BookBites website, mobile applications, and services (collectively, the "Service").
              </p>
              
              <p>
                By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
              </p>
              
              <h2>1. Account Registration</h2>
              <p>
                To access certain features of the Service, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              
              <h2>2. Subscriptions and Payments</h2>
              <p>
                2.1. Subscription Options: BookBites offers various subscription plans that provide access to book summaries. The features included in each subscription plan are described on our pricing page.
              </p>
              
              <p>
                2.2. Payment: When you subscribe to a paid plan, you agree to pay the fees indicated for that subscription. All payments are processed securely through our payment processors.
              </p>
              
              <p>
                2.3. Automatic Renewal: Your subscription will automatically renew at the end of each subscription period unless you cancel it before the renewal date.
              </p>
              
              <p>
                2.4. Cancellation: You may cancel your subscription at any time through your account settings. Cancellations will take effect at the end of your current billing cycle.
              </p>
              
              <h2>3. Intellectual Property</h2>
              <p>
                3.1. Our Content: The Service and its original content, features, and functionality are owned by BookBites and are protected by intellectual property laws. The book summaries, audio recordings, videos, and other materials provided through the Service are the property of BookBites or its content suppliers and are protected by copyright laws.
              </p>
              
              <p>
                3.2. Use Restrictions: You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service, except as permitted by these Terms.
              </p>
              
              <h2>4. User Content</h2>
              <p>
                4.1. User Contributions: The Service may contain message boards, forums, personal profiles, and other interactive features that allow users to post, submit, publish, display, or transmit content or materials.
              </p>
              
              <p>
                4.2. License: By posting content on the Service, you grant BookBites a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, copy, modify, create derivative works based on, distribute, publicly display, publicly perform, and otherwise exploit in any manner such content in all formats and distribution channels now known or hereafter devised.
              </p>
              
              <h2>5. Prohibited Uses</h2>
              <p>
                You agree not to use the Service:
              </p>
              <ul>
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To impersonate or attempt to impersonate BookBites, a BookBites employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by BookBites, may harm BookBites or users of the Service</li>
              </ul>
              
              <h2>6. Termination</h2>
              <p>
                BookBites may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
              </p>
              
              <h2>7. Disclaimer of Warranties</h2>
              <p>
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
              
              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall BookBites, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
              
              <h2>9. Changes to Terms</h2>
              <p>
                BookBites reserves the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at terms@bookbites.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
