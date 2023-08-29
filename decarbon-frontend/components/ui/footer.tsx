import React from "react";
import { FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6" style={{
        marginTop: "20px",
        padding: "8px",
        borderRadius: "10px"
    }}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-2">About deCarbon</h3>
          <p className="text-gray-300">
            We&apos;re on a mission to provide insights into blockchain carbon emissions.
          </p>
        </div>
        <div className="flex mt-4 md:mt-0">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-4 text-gray-300 hover:text-white"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://github.com/decarbon-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-4 text-gray-300 hover:text-white"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="mailto:nddminh2021@gmail.com"
            className="text-gray-300 hover:text-white"
          >
            <FaEnvelope size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
