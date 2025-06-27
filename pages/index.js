import { useState } from 'react'
import Head from 'next/head'
import { Calculator, Scale, FileText, ChevronRight, Briefcase, Home } from 'lucide-react'
import UnifiedFeeCalculator from '../components/UnifiedFeeCalculator'

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null)

  const tools = [
    {
      id: 'fee-calculator',
      title: 'Công Cụ Tính Phí Công Chứng',
      description: 'Tính toán nhanh chóng phí dịch thuật, công chứng hợp đồng, chứng thực và cấp bản sao',
      icon: Calculator,
      color: 'from-blue-500 to-indigo-600',
      features: [
        'Tính phí dịch thuật & công chứng',
        'Tính phí công chứng hợp đồng',
        'Tính phí chứng thực bản sao',
        'Tính phí cấp bản sao công chứng'
      ],
      component: UnifiedFeeCalculator
    }
    // Có thể thêm các công cụ khác ở đây trong tương lai
  ]

  if (selectedTool) {
    const SelectedComponent = selectedTool.component
    return (
      <>
        <Head>
          <title>{selectedTool.title} - VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm</title>
          <meta name="description" content={selectedTool.description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation Bar */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Trang chủ</span>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">{selectedTool.title}</h1>
                <div className="w-24"></div>
              </div>
            </div>
          </div>
          <SelectedComponent />
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Công Cụ Hỗ Trợ Văn Phòng Công Chứng - VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm</title>
        <meta name="description" content="Bộ công cụ hỗ trợ công việc văn phòng công chứng chuyên nghiệp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  <Briefcase className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Công Cụ Hỗ Trợ Văn Phòng Công Chứng
              </h1>
              <p className="text-xl text-blue-100 mb-2">
                VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm
              </p>
              <p className="text-lg text-blue-200">
                Giải pháp toàn diện cho công việc công chứng chuyên nghiệp
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Chọn Công Cụ</h2>
            <p className="text-lg text-gray-600">
              Các công cụ được thiết kế để tối ưu hóa quy trình làm việc tại văn phòng công chứng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  {/* Tool Header */}
                  <div className={`bg-gradient-to-r ${tool.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <tool.icon className="w-10 h-10" />
                      <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className="text-white/90 text-sm">{tool.description}</p>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Tính năng chính:</h4>
                    <ul className="space-y-2">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 group">
                      <span>Sử dụng công cụ</span>
                      <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Placeholder for future tools */}
            <div className="group cursor-not-allowed opacity-60">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-gray-300">
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Scale className="w-10 h-10" />
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Sắp ra mắt</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Công Cụ Mới</h3>
                  <p className="text-white/90 text-sm">Đang phát triển thêm công cụ hỗ trợ</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-center">
                    Các công cụ mới sẽ được cập nhật trong thời gian tới
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Scale className="w-6 h-6" />
                <p className="text-lg font-bold">
                  VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm
                </p>
              </div>
              <p className="text-blue-100">
                Chính xác - Nhanh chóng - Chuyên nghiệp
              </p>
              <p className="text-blue-200 text-sm mt-2">
                © {new Date().getFullYear()} Tất cả quyền được bảo lưu
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
