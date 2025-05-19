
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageViewTracking } from "@/hooks/useAnalytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Info } from "lucide-react";

const About = () => {
  const { t } = useTranslation();
  
  // Track page view
  usePageViewTracking('/about', 'About Us');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <Info className="h-8 w-8 text-book-700" />
              <h1 className="text-3xl font-serif font-bold">About BookBites</h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                BookBites was founded in 2023 with a simple mission: to make knowledge from the world's best books accessible to everyone.
              </p>
              
              <p>
                In today's fast-paced world, finding time to read all the books you want can be challenging. That's where BookBites comes in - we provide concise, thoughtful summaries of important books across various categories.
              </p>
              
              <h2>Our Vision</h2>
              <p>
                We believe that great ideas should be accessible to everyone. Our vision is to create a world where knowledge barriers are removed, and powerful insights from books can reach anyone, regardless of their reading time constraints.
              </p>
              
              <h2>How It Works</h2>
              <p>
                Our team of expert readers and writers carefully select important books across various categories. We read them thoroughly and create high-quality summaries that capture the key ideas, insights, and takeaways.
              </p>
              
              <p>
                We offer these summaries in multiple formats:
              </p>
              <ul>
                <li>Written summaries for those who prefer to read</li>
                <li>Audio summaries for listening on the go</li> 
                <li>Video summaries for visual learners</li>
              </ul>
              
              <h2>Our Team</h2>
              <p>
                BookBites is made up of avid readers, writers, and knowledge enthusiasts who are passionate about making great ideas accessible. Our diverse team includes subject matter experts across various fields, ensuring that our summaries are not just concise but also accurate and insightful.
              </p>
              
              <h2>Join Us</h2>
              <p>
                We're always looking for talented individuals who share our passion for knowledge sharing. If you're interested in joining our team, please visit our careers page.
              </p>
              
              <p>
                Thank you for being part of the BookBites community. Together, we're making the world's knowledge more accessible, one book summary at a time.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
