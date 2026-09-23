import Link from 'next/link';
import { FaTelegramPlane, FaFacebookF, FaTwitter, FaInstagram, FaGooglePlay } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-[#1e293b] text-white py-8 px-4 text-center border-t border-slate-700">
            {/* Disclaimer Text */}
            <div className="max-w-6xl mx-auto mb-8 text-left bg-slate-100 text-slate-800 px-6 py-5 rounded-sm">
                <p className="text-sm md:text-base leading-7">
                    <span className="text-red-600 font-medium">Disclaimer:</span>{" "}
                    This website will not be responsible for any minor or major mistakes
                    or inaccuracies. We try our best to provide correct and useful
                    information based on official recruitment notifications,
                    advertisements and other publicly available sources. However,
                    sometimes mistakes may happen due to typing errors, outdated
                    information or changes from the official organization.
                    Our effort and intention is to provide accurate information as much
                    as possible. Before taking any action, please verify the details
                    from the official recruitment notification or official website.
                    <span className="font-medium"> We hope you understand.</span>
                </p>
            </div>
            {/* Top Heading */}
            <h3 className="text-xl md:text-2xl font-semibold mb-6 tracking-wide text-slate-100">
                Follow Us On
            </h3>

            {/* Social Icons Row */}
            <div className="flex justify-center items-center gap-6 mb-8">
                {/* Telegram */}
                <a
                    href="https://t.me"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-white text-lg hover:bg-slate-700 hover:scale-110 transition-all duration-200"
                    title="Telegram"
                >
                    <FaTelegramPlane />
                </a>

                {/* Facebook */}
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-white text-lg hover:bg-slate-700 hover:scale-110 transition-all duration-200"
                    title="Facebook"
                >
                    <FaFacebookF />
                </a>

                {/* Twitter */}
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-white text-lg hover:bg-slate-700 hover:scale-110 transition-all duration-200"
                    title="Twitter"
                >
                    <FaTwitter />
                </a>

                {/* Instagram */}
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-white text-lg hover:bg-slate-700 hover:scale-110 transition-all duration-200"
                    title="Instagram"
                >
                    <FaInstagram />
                </a>

                {/* Play Store */}
                <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-white text-lg hover:bg-slate-700 hover:scale-110 transition-all duration-200"
                    title="Google Play"
                >
                    <FaGooglePlay />
                </a>
            </div>

            {/* Copyright Text */}
            <p className="text-xs md:text-sm text-slate-300 font-normal tracking-wide">
                Copyright © 2024 - {new Date().getFullYear()} ZOOM UPDATE, All Rights Reserved
            </p>
        </footer>
    );
}