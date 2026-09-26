import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us - ZOOM UPDATE',
  description: 'Official Contact Us page of ZOOM UPDATE',
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-2 sm:px-4 py-6">
          {/* Main Box */}
          <div className="bg-white rounded-lg border border-red-400 shadow-sm overflow-hidden">
            
            {/* Red Top Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-center py-2.5 text-lg sm:text-xl">
              Contact Us
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4">
              <p>
                This is ZoomUpdate.com Contact Us official page where you can find our official email address. If you have any queries related to any post (s) and website; you can mail me without any hesitation. Within a moment our team will look into your matters and solve your queries. Feel free to ask, I'll be very happy to solve your issues on given below email address.
              </p>

              {/* Email Box */}
              <div className="pt-2 pb-2">
                <div className="border border-gray-800 rounded py-2 px-4 text-center max-w-lg mx-auto bg-white shadow-xs">
                  <a
                    href="mailto:contact@zoomupdate.com"
                    className="text-blue-600 hover:underline font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <span>✉️</span>
                    <span>contact@zoomupdate.com</span>
                  </a>
                </div>
              </div>

              <p>
                In addition to email address you can contact with our social media handle, page and channel. You can find our social media links below.
              </p>
            </div>

          </div>
          
        </main>
      </div>

      <Footer />
    </div>
  );
}