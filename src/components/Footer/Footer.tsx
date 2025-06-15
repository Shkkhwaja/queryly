import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaGraduationCap } from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";
import Link from "next/link";
import {useEffect,useState} from "react"
import { FaArrowUp } from "react-icons/fa";


const Footer: React.FC = () => {


    const [showScrollButton, setShowScrollButton] = useState(false);


    useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };



  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white py-12">


        {/* Scroll to Top Button */}
      {showScrollButton && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-gray-600 transition-colors z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaGraduationCap className="text-3xl" />
              <span className="text-2xl font-bold font-bangers">Queryly</span>
            </div>
            <p className="text-blue-100 dark:text-gray-300">
              Your AI-powered Q&A platform for TMV College. Get instant answers to your academic questions.
            </p>
            <div className="flex space-x-4">
              <Link href="/" className="hover:text-blue-200 transition-colors">
                <FaGithub className="text-xl" />
              </Link>
              <Link href="/" className="hover:text-blue-200 transition-colors">
                <FaTwitter className="text-xl" />
              </Link>
              <Link href="/" className="hover:text-blue-200 transition-colors">
                <FaLinkedin className="text-xl" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-blue-200 transition-colors">Home</Link></li>
              <li><Link href="/" className="hover:text-blue-200 transition-colors">Ask Question</Link></li>
              <li><Link href="/" className="hover:text-blue-200 transition-colors">Browse Questions</Link></li>
              <li><Link href="/" className="hover:text-blue-200 transition-colors">Popular Topics</Link></li>
            </ul>
          </div>

          {/* Semesters */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Semesters</h3>
            <ul className="space-y-2">
              {["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"].map((sem) => (
                <li key={sem}>
                  <Link 
                    href={`/semester/${sem.toLowerCase().replace(' ', '-')}`}
                    className="hover:text-blue-200 transition-colors"
                  >
                    {sem}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FaEnvelope />
                <Link 
                  href="mailto:queryly.co.in@gmail.com" 
                  className="hover:text-blue-200 transition-colors"
                >
                  queryly.co.in@gmail.com
                </Link>
              </li>
              
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-500 dark:border-gray-700 mt-8 pt-8 text-center text-blue-200 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Queryly. All rights reserved.</p>
<p className="text-sm mt-2">Made with ❤️ by <span className="underline text-white">Khwaja Hussain Shaikh</span> for TMV College students</p>        </div>
      </div>
    </footer>
  );
};

export default Footer;