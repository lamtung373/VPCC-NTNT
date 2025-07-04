import React from 'react';
import { useRouter } from 'next/router';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-4 sm:p-8 text-white shadow-xl">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Scale className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center leading-tight">
              Bộ công cụ hỗ trợ văn phòng công chứng
            </h1>
          </div>
          <p className="text-center text-blue-100 text-sm sm:text-lg">VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm</p>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-b-2xl p-4 sm:p-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
            Chọn công cụ cần sử dụng
          </h2>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="bg-white/20 backdrop-blur rounded-lg p-2 sm:p-3 group-hover:bg-white/30 transition-colors duration-300 flex-shrink-0">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-50 transition-colors duration-300 break-words">
                          {tool.title}
                        </h3>
                        <p className="text-blue-100 text-sm leading-relaxed break-words">
                          {tool.description}
                        </p>
                        
                        <div className="mt-3 sm:mt-4 flex items-center text-white/90 font-medium group-hover:text-white transition-colors duration-300">
                          <span className="text-xs sm:text-sm">Sử dụng công cụ</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Contact for new tools */}
            <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1">
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-lg hover:shadow-2xl">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="bg-blue-100 rounded-lg p-2 sm:p-3 group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 group-hover:text-blue-900 transition-colors duration-300 break-words">
                      Đề xuất công cụ mới
                    </h3>
                    <p className="text-blue-600 text-sm leading-relaxed mb-3 sm:mb-4 break-words">
                      Bạn cần công cụ hỗ trợ khác? Chúng tôi sẵn sàng phát triển theo yêu cầu.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="text-blue-700 font-medium text-sm">Liên hệ: Lâm Tùng</div>
                      <div className="flex flex-wrap gap-2">
                        <a 
                          href="tel:0941108117"
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          0941108117
                        </a>
                        <a 
                          href="https://zalo.me/0941108117"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
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
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-xl p-4 sm:p-6">
          <div className="text-center">
            <p className="text-white font-bold text-sm sm:text-lg flex items-center justify-center gap-2">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
              © {new Date().getFullYear()} VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm
            </p>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              Chính xác - Nhanh chóng - Chuyên nghiệp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
