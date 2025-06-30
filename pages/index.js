import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Calculator, FileText, Scale, ChevronRight, Calendar, Clock } from 'lucide-react';

const HomePage = () => {
  const router = useRouter();
  
  // Danh sách công cụ - có thể thêm công cụ mới vào đây
  const tools = [
    {
      id: 'fee-calculator',
      title: 'Tính phí công chứng',
      description: 'Tính phí dịch thuật, công chứng, chứng thực nhanh chóng và chính xác',
      icon: Calculator,
      path: '/fee-calculator'
    },
    {
      id: 'date-calculator',
      title: 'Tính toán thời gian',
      description: 'Tính toán thời hạn hiệu lực, ngày hết hạn và số ngày làm việc cho các loại giấy tờ',
      icon: Calendar,
      path: '/date-calculator'
    },
    // Có thể thêm công cụ khác ở đây trong tương lai
  ];

  const handleToolClick = (tool) => {
    router.push(tool.path);
  };

  return (
    <>
      <Head>
        <title>Bộ Công Cụ Hỗ Trợ Văn Phòng Công Chứng - VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm</title>
        <meta name="description" content="Bộ công cụ hỗ trợ tính phí công chứng, dịch thuật, chứng thực và tính toán thời gian cho văn phòng công chứng. Chính xác, nhanh chóng, chuyên nghiệp." />
        <meta name="keywords" content="công chứng, phí công chứng, dịch thuật, chứng thực, tính phí, công cụ, văn phòng công chứng, Bình Dương, VPCC" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Bộ Công Cụ Hỗ Trợ Văn Phòng Công Chứng - VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm" />
        <meta property="og:description" content="Bộ công cụ hỗ trợ tính phí công chứng, dịch thuật, chứng thực và tính toán thời gian cho văn phòng công chứng. Chính xác, nhanh chóng, chuyên nghiệp." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bộ Công Cụ Hỗ Trợ Văn Phòng Công Chứng" />
        <meta name="twitter:description" content="Bộ công cụ hỗ trợ tính phí công chứng, dịch thuật, chứng thực và tính toán thời gian cho văn phòng công chứng." />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="application-name" content="VPCC Tools" />
        
        {/* Canonical URL - bạn có thể cập nhật domain thực tế */}
        <link rel="canonical" href="https://vpcc-tools.vercel.app/" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Bộ Công Cụ Hỗ Trợ Văn Phòng Công Chứng",
              "description": "Bộ công cụ hỗ trợ tính phí công chứng, dịch thuật, chứng thực và tính toán thời gian cho văn phòng công chứng",
              "url": "https://vpcc-tools.vercel.app/",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "VND"
              },
              "provider": {
                "@type": "Organization",
                "name": "VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "VN",
                  "addressRegion": "Hồ Chí Minh"
                }
              },
              "featureList": [
                "Tính phí dịch thuật và công chứng",
                "Tính phí công chứng hợp đồng", 
                "Tính phí chứng thực bản sao",
                "Tính phí cấp bản sao công chứng",
                "Tính toán thời gian và thời hạn hiệu lực"
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scale className="w-10 h-10" />
              <h1 className="text-3xl md:text-4xl font-bold">Bộ công cụ hỗ trợ văn phòng công chứng</h1>
            </div>
            <p className="text-center text-blue-100 text-lg">VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm</p>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow-xl rounded-b-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Chọn công cụ cần sử dụng
            </h2>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="bg-white/20 backdrop-blur rounded-lg p-3 group-hover:bg-white/30 transition-colors duration-300">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-50 transition-colors duration-300">
                            {tool.title}
                          </h3>
                          <p className="text-blue-100 text-sm leading-relaxed">
                            {tool.description}
                          </p>
                          
                          <div className="mt-4 flex items-center text-white/90 font-medium group-hover:text-white transition-colors duration-300">
                            <span className="text-sm">Sử dụng công cụ</span>
                            <ChevronRight className="w-4 h-4 ml-2 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Contact for new tools */}
              <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1">
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors duration-300">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-800 mb-2 group-hover:text-blue-900 transition-colors duration-300">
                        Đề xuất công cụ mới
                      </h3>
                      <p className="text-blue-600 text-sm leading-relaxed mb-4">
                        Bạn cần công cụ hỗ trợ khác? Chúng tôi sẵn sàng phát triển theo yêu cầu.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
                        <div className="text-blue-700 font-medium">Liên hệ: Lâm Tùng</div>
                        <div className="flex gap-2">
                          <a 
                            href="tel:0941108117"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors font-medium text-sm"
                          >
                            0941108117
                          </a>
                          <a 
                            href="https://zalo.me/0941108117"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors font-medium text-sm"
                          >
                            Zalo
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-xl p-6">
            <div className="text-center">
              <p className="text-white font-bold text-lg flex items-center justify-center gap-2">
                <Scale className="w-5 h-5" />
                © {new Date().getFullYear()} VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm
              </p>
              <p className="text-blue-100 text-sm mt-1">
                Chính xác - Nhanh chóng - Chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
