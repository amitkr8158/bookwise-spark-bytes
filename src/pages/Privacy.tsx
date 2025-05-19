
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield } from "lucide-react";

const Privacy = () => {
  const { t } = useTranslation();
  
  // Track page view
  usePageViewTracking('/privacy', 'Privacy Policy');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <Shield className="h-8 w-8 text-book-700" />
              <h1 className="text-3xl font-serif font-bold">Privacy Policy</h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>Last Updated: May 19, 2025</p>
              
              <p>
                At BookBites, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, and services (collectively, the "Service").
              </p>
              
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
              </p>
              
              <h2>1. Information We Collect</h2>
              
              <h3>1.1. Personal Information</h3>
              <p>
                We collect personal information that you voluntarily provide to us when you register for the Service, express an interest in obtaining information about us or our products and services, or otherwise contact us. This personal information may include:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Payment information</li>
                <li>Account preferences</li>
              </ul>
              
              <h3>1.2. Usage Data</h3>
              <p>
                We may also collect information about how the Service is accessed and used. This usage data may include:
              </p>
              <ul>
                <li>Your device's IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages of our Service that you visit</li>
                <li>Time and date of your visit</li>
                <li>Time spent on those pages</li>
                <li>Reading preferences</li>
              </ul>
              
              <h2>2. How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes, including:
              </p>
              <ul>
                <li>Providing and maintaining our Service</li>
                <li>Notifying you about changes to our Service</li>
                <li>Allowing you to participate in interactive features of our Service</li>
                <li>Providing customer support</li>
                <li>Gathering analysis to improve our Service</li>
                <li>Monitoring usage of our Service</li>
                <li>Detecting, preventing, and addressing technical issues</li>
                <li>Sending you marketing and promotional communications</li>
                <li>Personalizing your experience</li>
              </ul>
              
              <h2>3. Data Security</h2>
              <p>
                We value your trust in providing us your personal information, and we strive to use commercially acceptable means of protecting it. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
              </p>
              
              <h2>4. Third-Party Services</h2>
              <p>
                Our Service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
              </p>
              <p>
                We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
              </p>
              
              <h2>5. Children's Privacy</h2>
              <p>
                Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with personal information, please contact us. If we discover that we have collected personal information from children without verification of parental consent, we will take steps to remove that information from our servers.
              </p>
              
              <h2>6. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul>
                <li>The right to access the personal information we have about you</li>
                <li>The right to rectify inaccurate personal information</li>
                <li>The right to request erasure of your personal information</li>
                <li>The right to restrict or object to the processing of your personal information</li>
                <li>The right to data portability</li>
              </ul>
              
              <h2>7. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
              
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@bookbites.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
