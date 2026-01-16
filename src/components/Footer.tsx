import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-white/10 py-8 bg-[#1a1a1a]">
            <div className="container mx-auto px-4 text-center text-white/40 text-sm">
                <p>&copy; {new Date().getFullYear()} LuxStay Hospitality. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4">
                    <a href="#" className="hover:text-blue-400">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-400">Terms of Service</a>
                    <a href="#" className="hover:text-blue-400">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
