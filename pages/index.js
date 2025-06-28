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
      title: 'Tính thời hạn giấy tờ',
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
            
            {/* Placeholder for future tools */}
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 flex items-center justify-center text-gray-500 bg-blue-50/50 min-h-[140px]">
              <div className="text-center">
                <FileText className="w-8 h-8 mb-2 mx-auto text-blue-400" />
                <p className="text-sm font-medium text-blue-600">
                  Công cụ mới sẽ được cập nhật
                </p>
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
            <p className="text-blue-200 text-xs mt-1">
              Phiên bản 0.1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
