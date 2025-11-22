"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const roles = ["Developer", "Web Designer", "Programmer"];

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    fetchGitHubProjects();
  }, [hydrated]);

  const fetchGitHubProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await fetch("/api/github-projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return JSON. Check if the endpoint exists and returns valid JSON.");
      }
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      } else {
        throw new Error(data.message || "Failed to load projects");
      }
    } catch (error) {
      console.error("Error fetching GitHub projects:", error);
      setProjectsError(error.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  async function handleContactSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitMessage(
        "✅ Message sent successfully! I'll get back to you soon."
      );
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitMessage("❌ Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (field, value) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div
      className="min-h-screen bg-black text-white font-bold transition-colors duration-300"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-700">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-pink-400 animate-glow">
            KULDEEP
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", id: "home" },
              { name: "About", id: "about" },
              { name: "Skills", id: "skills" },
              { name: "Projects", id: "projects" },
              { name: "Services", id: "services" },
              { name: "Contact", id: "contact" },
            ].map((item, index) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="relative hover:text-pink-400 transition-colors duration-300 font-medium text-white hover:text-pink-400 group"
              >
                {item.name}
                <span className="absolute left-0 bottom-[-8px] w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-4 pt-20"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Photo on the left */}
          <div className="animate-slide-left">
            <img
              src="https://via.placeholder.com/400x500/EC4899/FFFFFF?text=Kuldeep"
              alt="Kuldeep"
              className="rounded-full shadow-lg w-full hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Text content on the right */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
              Hi, It's <span className="text-pink-400">Kuldeep</span>
            </h1>

            <h2 className="text-xl md:text-2xl mb-8 text-gray-300 animate-fade-in">
              I'm a{" "}
              <span className="text-pink-400 animate-typing">
                {roles[currentRole]}
              </span>
            </h2>

            <p className="text-lg leading-relaxed mb-8 text-gray-300 animate-slide-up-delayed">
              I am a first-year BTech student specializing in{" "}
              <span className="text-pink-400">
                Electronics and Communication Engineering (ECE)
              </span>{" "}
              with a passion for web development. Currently, I am honing my
              skills in{" "}
              <span className="text-pink-400">
                Data Structures and Algorithms (DSA)
              </span>{" "}
              using Java, while actively working on projects in HTML, CSS and
              Javascript. With a strong interest in building innovative and
              efficient web applications, I aim to continuously improve my
              technical expertise and contribute to impactful projects in the
              field of software development.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delayed-2 justify-center md:justify-start">
              <button className="border border-pink-600 hover:bg-pink-600 px-8 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Hire Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <img
                src="https://via.placeholder.com/400x500/EC4899/FFFFFF?text=Profile+Photo"
                alt="Kuldeep"
                className="rounded-lg shadow-lg w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="animate-slide-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Designing Is My{" "}
                <span className="text-pink-400 animate-glow">Passion</span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                Designing is my passion 🎨. From crafting intuitive user
                interfaces to creating stunning visual experiences 🌟, design is
                where I find my flow. With every project, I strive to blend
                creativity and functionality, ensuring that each design not only
                looks great but also serves its purpose effectively 🖌️. My
                journey in design is driven by a relentless pursuit of
                innovation and a commitment to continuous improvement 📈.
                Whether it's a website, app, or graphic, I pour my heart and
                soul into every design, aiming to create something truly unique
                and impactful 💫.
              </p>
              <a
                href="#"
                className="inline-flex items-center bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl animate-float"
              >
                Download CV 📄
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
            <p className="text-xl text-gray-300">
              Skills Reflects Our Knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                In the realm of web development, skills truly reflect our
                knowledge and capabilities. My proficiency in HTML (90%) and CSS
                (50%) showcases a strong foundation in crafting structured and
                visually engaging web pages 🖥️📄. With a solid grasp of
                JavaScript (60%) 💡, I infuse interactivity and dynamic behavior
                into my projects, enhancing the overall user experience 🌐.
                Additionally, my growing proficiency in Java (45%) ⚙️ adds
                backend versatility to my toolkit, allowing me to approach
                development with a more well-rounded perspective. This diverse
                skill set empowers me to build comprehensive and impactful
                websites, blending creativity with technical expertise 🚀✨.
              </p>

              <div className="text-center animate-bounce-in">
                <div className="text-4xl font-bold text-pink-400 mb-2 animate-counter">
                  6
                </div>
                <div className="text-lg text-gray-300">
                  Months Of Experience
                </div>
              </div>
            </div>

            <div className="space-y-6 animate-slide-right">
              {[
                { skill: "HTML", percentage: 85 },
                { skill: "CSS", percentage: 50 },
                { skill: "JavaScript", percentage: 60 },
                { skill: "Java", percentage: 45 },
              ].map((item, index) => (
                <div
                  key={item.skill}
                  className="animate-skill-bar"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">{item.skill}</span>
                    <span className="text-pink-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-black rounded-full h-3">
                    <div
                      className="bg-pink-600 h-3 rounded-full transition-all duration-2000 animate-progress-fill"
                      style={{
                        width: `${item.percentage}%`,
                        animationDelay: `${index * 0.3}s`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
            <p className="text-xl text-gray-300">
              Recent projects from my GitHub 💻
            </p>
          </div>

          {loadingProjects ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
              <p className="mt-4 text-gray-300">Loading projects...</p>
            </div>
          ) : projectsError ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">❌ {projectsError}</div>
              <button
                onClick={fetchGitHubProjects}
                className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg font-bold transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300">
                No projects found. Add some projects to your GitHub! 🚀
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="bg-gray-900 hover:bg-gray-800 p-6 rounded-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-card-float border border-gray-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-pink-400 hover:text-pink-300 transition-colors">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.name}
                      </a>
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      {project.language && (
                        <span className="bg-pink-600 text-white px-2 py-1 rounded text-xs">
                          {project.language}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span>{project.stars}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>🔗</span>
                        <span>{project.forks}</span>
                      </span>
                    </div>
                    <span className="text-xs">
                      Updated {new Date(project.updated).toLocaleDateString()}
                    </span>
                  </div>

                  {project.topics && project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.topics.slice(0, 3).map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                      {project.topics.length > 3 && (
                        <span className="text-gray-400 text-xs">
                          +{project.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-center py-2 rounded font-bold transition-all duration-300 hover:scale-105"
                    >
                      View Code 💻
                    </a>
                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 border border-pink-600 hover:bg-pink-600 text-center py-2 rounded font-bold transition-all duration-300 hover:scale-105"
                      >
                        Live Demo 🚀
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Services</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Web Development",
                description:
                  "Web development combines coding and design to build functional and attractive websites. It's all about creating seamless user experiences online 🌐.",
                icon: "💻",
              },
              {
                title: "Graphic Design",
                description:
                  "Graphic design merges creativity with technology to craft visual content. From logos to marketing materials, it communicates ideas through stunning visuals 🌟.",
                icon: "🎨",
              },
              {
                title: "Digital Marketing",
                description:
                  "Digital marketing uses online channels to promote products and services. It aims to reach target audiences, build brand awareness, and drive conversions 🌍.",
                icon: "📱",
              },
              {
                title: "Icon Design",
                description:
                  "Icon design creates small, recognizable graphics for user interfaces. It's about blending simplicity with clarity to guide users efficiently 📱.",
                icon: "🎯",
              },
              {
                title: "Photography",
                description:
                  "Photography captures moments through the lens, blending technical skill with artistic vision. It's all about telling stories and evoking emotions 🌅.",
                icon: "📸",
              },
              {
                title: "Apps Development",
                description:
                  "Apps development involves creating mobile applications that are functional and user-friendly. It's essential for providing engaging digital experiences on-the-go 🚀.",
                icon: "📲",
              },
            ].map((service, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedService(selectedService === index ? null : index)
                }
                className={`p-6 rounded-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-card-float cursor-pointer ${
                  selectedService === index
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-black hover:bg-pink-300"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 animate-icon-bounce">
                  {service.icon}
                </div>
                <h3
                  className={`text-xl font-bold mb-4 ${
                    selectedService === index ? "text-white" : "text-pink-400"
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`leading-relaxed ${
                    selectedService === index
                      ? "text-pink-100"
                      : "text-gray-300"
                  }`}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Me</h2>
            <h3 className="text-xl md:text-2xl mb-8 text-pink-400 animate-glow">
              Have Any Project?
            </h3>
            <p className="text-lg leading-relaxed text-gray-300 mb-8 animate-slide-up">
              Do you have a project in mind? 🛠️ Let's bring it to life together!
              Whether it's a website, an app, or a design project, I'm here to
              help you turn your ideas into reality 💡. Drop me a message below!
            </p>
          </div>

          <form
            onSubmit={handleContactSubmit}
            className="space-y-6 animate-slide-up-delayed"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-bold mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-400 transition-colors duration-300"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-white font-bold mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-400 transition-colors duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                Your Message *
              </label>
              <textarea
                required
                rows={6}
                value={contactForm.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-400 transition-colors duration-300 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-pulse-glow"
              >
                {isSubmitting ? "Sending..." : "Send Message 📧"}
              </button>
            </div>

            {submitMessage && (
              <div className="text-center mt-4">
                <p
                  className={`text-lg font-bold ${submitMessage.includes("✅") ? "text-green-400" : "text-red-400"}`}
                >
                  {submitMessage}
                </p>
              </div>
            )}
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">Or reach me directly:</p>
            <a
              href="mailto:kuldeepsisodiya901@gmail.com"
              className="text-pink-400 hover:text-pink-300 font-bold"
            >
              kuldeepsisodiya901@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">© 2024 Kuldeep. All rights reserved.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 5px #ec4899, 0 0 10px #ec4899, 0 0 15px #ec4899;
          }
          50% {
            text-shadow: 0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 30px #ec4899;
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes cardFloat {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 5px #ec4899;
          }
          50% {
            box-shadow: 0 0 20px #ec4899, 0 0 30px #ec4899;
          }
        }

        @keyframes bounceSlow {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        .animate-slide-up {
          animation: slideUp 1s ease-out;
        }

        .animate-slide-up-delayed {
          animation: slideUp 1s ease-out 0.3s both;
        }

        .animate-slide-up-delayed-2 {
          animation: slideUp 1s ease-out 0.6s both;
        }

        .animate-slide-left {
          animation: slideLeft 1s ease-out;
        }

        .animate-slide-right {
          animation: slideRight 1s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-bounce-in {
          animation: bounceIn 1s ease-out;
        }

        .animate-card-float {
          animation: cardFloat 0.8s ease-out;
        }

        .animate-icon-bounce {
          animation: iconBounce 2s infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s infinite;
        }

        .animate-bounce-slow {
          animation: bounceSlow 4s infinite;
        }

        .animate-pulse-subtle {
          animation: pulseGlow 3s infinite;
        }

        .animate-typing {
          display: inline-block;
          animation: glow 1s ease-in-out;
        }

        .animate-skill-bar {
          animation: slideRight 0.8s ease-out;
        }

        .animate-progress-fill {
          animation: progressFill 2s ease-out;
        }

        .animate-counter {
          animation: bounceIn 1.5s ease-out;
        }
      `}</style>
    </div>
  );
}
