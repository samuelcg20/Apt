'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    // Add smooth scrolling behavior
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl z-50 transition-all duration-300 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center h-20">
          <div className="nav-logo">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
              APT
            </h2>
          </div>
          <ul className="hidden md:flex list-none gap-12">
            <li>
              <a href="#home" className="text-white font-medium text-base transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5 relative py-2">
                Home
              </a>
            </li>
            <li>
              <a href="#problem-solution" className="text-white font-medium text-base transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5 relative py-2">
                Problem & Solution
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="text-white font-medium text-base transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5 relative py-2">
                How It Works
              </a>
            </li>
            <li>
              <a href="#founders" className="text-white font-medium text-base transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5 relative py-2">
                Meet the Founders
              </a>
            </li>
            <li>
              <a href="#get-started" className="text-white font-medium text-base transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5 relative py-2">
                Get Started
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-5 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Where Students Gain Experience &<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Startups Get Work Done.
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto lg:mx-0">
              APT connects Singaporean students with startups and SMEs for real-world, project-based collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link 
                href="/company/dashboard" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
              >
                Post a Task
              </Link>
              <Link 
                href="/student/dashboard" 
                className="bg-transparent border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 transform hover:scale-105"
              >
                Find Opportunities
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col items-center space-y-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-xl">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Startups</span>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-xl">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="problem-solution" className="py-32 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            Real Problems. <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Real Solutions.</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
              <h3 className="text-2xl font-bold text-red-400 mb-6">The Problem</h3>
              <div className="space-y-4 text-gray-300">
                <p>Startups and SMEs often struggle with operational and digital challenges but lack the manpower and resources to solve them.</p>
                <p>Students, despite years of study, graduate with limited real-world work experience and weaker portfolios — making it harder to stand out in the job market.</p>
                <p>This creates a dual challenge: businesses stall in growth, and students struggle to break into meaningful roles.</p>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
              <h3 className="text-2xl font-bold text-green-400 mb-6">The Solution</h3>
              <div className="space-y-4 text-gray-300">
                <p>APT bridges this gap by empowering startups with affordable, flexible, and motivated student talent.</p>
                <p>Students gain real-world exposure by tackling actual business challenges, building skills, and earning income.</p>
                <p>Together, we create a cycle of growth: startups scale faster, and students step confidently into the workforce.</p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20">
              <h4 className="text-xl font-bold text-cyan-400 mb-4">Our Vision</h4>
              <p className="text-gray-300">A Singapore where no startup is held back by lack of talent, and no student graduates without practical industry experience.</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h4 className="text-xl font-bold text-purple-400 mb-4">Our Mission</h4>
              <p className="text-gray-300">Build the bridge between academia and the startup world — enabling collaborative problem-solving that benefits both businesses and emerging talent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            Three Simple Steps to <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Collaboration.</span>
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Companies Post an Issue</h3>
              <p className="text-gray-300">Briefs with scope, budget, and timeline.</p>
            </div>
            <div className="hidden lg:block">
              <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Students Apply with Proposals</h3>
              <p className="text-gray-300">Students showcase ideas, portfolios, or mini-solutions.</p>
            </div>
            <div className="hidden lg:block">
              <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Work Delivered via Milestones</h3>
              <p className="text-gray-300">Payments tied to deliverables, ensuring trust and accountability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founders Section */}
      <section id="founders" className="py-32 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-6">Meet the Founders</h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            The team behind APT — passionate about bridging opportunities between startups and students.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:border-cyan-500/50 transition-all duration-300">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/kaung-khant-minn.png"
                  alt="Kaung Khant Minn"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Kaung Khant Minn</h3>
              <p className="text-cyan-400 font-medium mb-2">Co-Founder</p>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/kaung-khant-minn-67845a2b7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56V24H.22V8zm7.44 0h4.38v2.16h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 6.98V24h-4.56v-7.72c0-1.84-.03-4.2-2.55-4.2-2.56 0-2.95 2-2.95 4.06V24H7.66V8z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:border-purple-500/50 transition-all duration-300">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/saajid-ahamed.png"
                  alt="Saajid Ahamed"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Saajid Ahamed</h3>
              <p className="text-purple-400 font-medium mb-2">Co-Founder</p>
              {/* Social Links */}
              <div className="flex justify-center space-x-4">

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/saajid-ahamed-37924a347/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56V24H.22V8zm7.44 0h4.38v2.16h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 6.98V24h-4.56v-7.72c0-1.84-.03-4.2-2.55-4.2-2.56 0-2.95 2-2.95 4.06V24H7.66V8z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:border-green-500/50 transition-all duration-300">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/sujith-kumaar.png"
                  alt="Sujith Kumaar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Sujith Kumaar</h3>
              <p className="text-green-400 font-medium mb-2">Co-Founder</p>
              {/* Social Links */}
              <div className="flex justify-center space-x-4">

                {/* LinkedIn */}
                <a
                  href="https://sg.linkedin.com/in/bill-sujith-kumaar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56V24H.22V8zm7.44 0h4.38v2.16h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 6.98V24h-4.56v-7.72c0-1.84-.03-4.2-2.55-4.2-2.56 0-2.95 2-2.95 4.06V24H7.66V8z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:border-pink-500/50 transition-all duration-300">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/samuel-christy-george.png"
                  alt="Samuel Christy George"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Samuel Christy George</h3>
              <p className="text-pink-400 font-medium mb-2">Co-Founder</p>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/samuel-christy-george/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56V24H.22V8zm7.44 0h4.38v2.16h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 6.98V24h-4.56v-7.72c0-1.84-.03-4.2-2.55-4.2-2.56 0-2.95 2-2.95 4.06V24H7.66V8z"/>
                  </svg>
                </a>
              </div>
            </div>


            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:border-orange-500/50 transition-all duration-300">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/mani-kumar-prateek.png"
                  alt="Mani Kumar Prateek"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Mani Kumar Prateek</h3>
              <p className="text-orange-400 font-medium mb-2">Co-Founder</p>
              {/* Social Links */}
              <div className="flex justify-center space-x-4">

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/mani-kumar-prateek-05624a296/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56V24H.22V8zm7.44 0h4.38v2.16h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.48 3.04 5.48 6.98V24h-4.56v-7.72c0-1.84-.03-4.2-2.55-4.2-2.56 0-2.95 2-2.95 4.06V24H7.66V8z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="get-started" className="py-32 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to bridge the gap?</h2>
          <p className="text-xl text-cyan-100 mb-12 max-w-3xl mx-auto">
            Join APT today and be part of Singapore&apos;s future of work.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/register?role=student" 
              className="bg-white text-cyan-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sign up as a Student
            </Link>
            <Link 
              href="/register?role=company" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-cyan-600 transition-all duration-300 transform hover:scale-105"
            >
              Sign up as a Startup
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8 mb-8 md:mb-0">
              <Link href="#problem-solution" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="#founders" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-gray-400">&copy; 2025 APT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}