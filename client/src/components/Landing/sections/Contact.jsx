import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isHovering, setIsHovering] = useState(false)
  const lottieOptions = {
    src: "https://lottie.host/ecd7dbb4-48e0-4e5d-adeb-7f0eed8b608f/G21L3G68B0.lottie",
    loop: true,
    autoplay: true,
    style: { width: "100%", height: "100%" },
    className: `w-full h-full transition-all duration-500 ${
      isHovering
        ? "scale-[180%] sm:scale-[160%] md:scale-[150%] lg:scale-[145%] rotate-2"
        : "scale-[175%] sm:scale-[155%] md:scale-[145%] lg:scale-[140%]"
    }`
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here (API/EmailJS integration)
    console.log("Form Data Submitted:", formData);
    alert("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="pb-20 ">
      <div className="container1 mx-auto px-6 lg:px-20">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-p4 font-Inknut mb-4">
            ✨ Get in Touch
          </h2>
          <p className="text-p5 max-w-2xl mx-auto">
            Have questions, feedback, or partnership inquiries? We’d love to
            hear from you! Fill out the form below and we'll get back to you.
          </p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

          {/* Contact Form */}
          <div className="w-full lg:w-1/2 bg-siteDimBlack shadow-lg p-8 rounded-2xl border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-siteViolet"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-siteViolet"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-siteViolet"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-siteViolet hover:bg-siteViolet/50 text-p4 font-bold py-3 rounded-lg transition "
              >
                🚀 Send Message
              </button>
            </form>
          </div>

          {/* Image/Illustration */}
          <div className="w-full lg:w-1/2 " onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <DotLottieReact {...lottieOptions} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
