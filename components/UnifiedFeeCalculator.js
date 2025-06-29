import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Copy, Globe, Scale, ChevronRight, FileCheck, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const UnifiedFeeCalculator = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('translation');
  
  // Translation states
  const [direction, setDirection] = useState('to-vietnamese');
  const [language, setLanguage] = useState('english');
  const [complexity, setComplexity] = useState('simple');
  const [pages, setPages] = useState('1');
  const [copies, setCopies] = useState('1');
  const [isSimilarContent, setIsSimilarContent] = useState(false);
  const [translationFee, setTranslationFee] = useState(0);
  const [notarizationFee, setNotarizationFee] = useState(0);
  const [totalTranslationFee, setTotalTranslationFee] = useState(0);
  
  // Notary states
  const [contractType, setContractType] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [serviceFee, setServiceFee] = useState('0');
  const [copyFee, setCopyFee] = useState('0');
  const [notaryFee, setNotaryFee] = useState(0);
  const [totalNotaryFee, setTotalNotaryFee] = useState(0);

  // Certification states
  const [certPages, setCertPages] = useState('1');
  const [certCopies, setCertCopies] = useState('1');
  const [certificationFee, setCertificationFee] = useState(0);

  // Notarized copy states
  const [notarizedPages, setNotarizedPages] = useState('1');
  const [notarizedCopies, setNotarizedCopies] = useState('1');
  const [notarizedCopyFee, setNotarizedCopyFee] = useState(0);

  // Translation rates
  const translationRates = {
    'to-vietnamese': {
      'simple': {
        'english': 75000,
        'chinese': 75000,
        'russian': 100000,
        'french': 100000,
        'korean': 120000,
        'japanese': 120000,
        'german': 120000,
        'other': 200000
      },
      'complex': {
        'english': 100000,
        'chinese': 100000,
        'russian': 120000,
        'french': 120000,
        'korean': 150000,
        'japanese': 150000,
        'german': 150000,
        'other': 200000
      }
    },
    'from-vietnamese': {
      'simple': {
        'english': 100000,
        'chinese': 100000,
        'russian': 120000,
        'french': 120000,
        'korean': 150000,
        'japanese': 150000,
        'german': 150000,
        'other': 300000
      },
      'complex': {
        'english': 120000,
        'chinese': 120000,
        'russian': 150000,
        'french': 150000,
        'korean': 200000,
        'japanese': 200000,
        'german': 200000,
        'other': 300000
      }
    }
  };

  const languageNames = {
    'english': 'Tiếng Anh',
    'chinese': 'Tiếng Hoa',
    'russian': 'Tiếng Nga',
    'french': 'Tiếng Pháp',
    'korean': 'Tiếng Hàn',
    'japanese': 'Tiếng Nhật',
    'german': 'Tiếng Đức',
    'other': 'Tiếng khác'
  };

  // Notary fee tables
  const economicFees = [
    { min: 0, max: 49999999, fee: 50000 },
    { min: 50000000, max: 100000000, fee: 100000 },
    { min: 100000001, max: 1000000000, rate: 0.001 },
    { min: 1000000001, max: 3000000000, base: 1000000, rate: 0.0006 },
    { min: 3000000001, max: 5000000000, base: 2200000, rate: 0.0005 },
    { min: 5000000001, max: 10000000000, base: 3200000, rate: 0.0004 },
    { min: 10000000001, max: 100000000000, base: 5200000, rate: 0.0003 },
    { min: 100000000001, max: Infinity, base: 32200000, rate: 0.0002, maxFee: 70000000 }
  ];

  const rentalFees = [
    { min: 0, max: 49999999, fee: 40000 },
    { min: 50000000, max: 100000000, fee: 80000 },
    { min: 100000001, max: 1000000000, rate: 0.0008 },
    { min: 1000000001, max: 3000000000, base: 800000, rate: 0.0006 },
    { min: 3000000001, max: 5000000000, base: 2000000, rate: 0.0005 },
    { min: 5000000001, max: 10000000000, base: 3000000, rate: 0.0004 },
    { min: 10000000001, max: Infinity, base: 5000000, rate: 0.0003, maxFee: 8000000 }
  ];

  // Translation calculations
  const calculateTranslationFee = () => {
    const pagesNum = parseInt(pages.replace(/\./g, '')) || 1;
    const baseRate = translationRates[direction][complexity][language];
    let fee = 0;

    if (isSimilarContent) {
      fee = baseRate;
      if (pagesNum > 1) {
        fee += (pagesNum - 1) * baseRate * 0.6;
      }
    } else {
      if (pagesNum <= 9) {
        fee = pagesNum * baseRate;
      } else {
        const discountRate = complexity === 'simple' ? 0.7 : 0.8;
        fee = 9 * baseRate + (pagesNum - 9) * baseRate * discountRate;
      }
    }

    return fee;
  };

  const calculateNotarizationFee = () => {
    const pagesNum = parseInt(pages.replace(/\./g, '')) || 1;
    const copiesNum = parseInt(copies.replace(/\./g, '')) || 1;
    let fee = 0;

    for (let copy = 1; copy <= copiesNum; copy++) {
      if (copy === 1) {
        fee += pagesNum * 10000;
      } else {
        let copyFee = 0;
        const firstTwoPages = Math.min(pagesNum, 2);
        copyFee += firstTwoPages * 5000;
        
        if (pagesNum > 2) {
          copyFee += (pagesNum - 2) * 3000;
        }
        
        copyFee = Math.min(copyFee, 200000);
        fee += copyFee;
      }
    }

    return fee;
  };

  // Notary calculations
  const calculateNotaryFee = (value, type) => {
    if (!value || value <= 0) return 0;
    
    const feeTable = type === 'economic' ? economicFees : rentalFees;
    
    for (let tier of feeTable) {
      if (value >= tier.min && value <= tier.max) {
        if (tier.fee) {
          return tier.fee;
        } else if (tier.rate) {
          let calculatedFee;
          if (tier.base) {
            calculatedFee = tier.base + (value - tier.min) * tier.rate;
          } else {
            calculatedFee = value * tier.rate;
          }
          
          if (tier.maxFee && calculatedFee > tier.maxFee) {
            return tier.maxFee;
          }
          return calculatedFee;
        }
      }
    }
    return 0;
  };

  // Certification calculation
  const calculateCertificationFee = () => {
    const pagesNum = parseInt(certPages.replace(/\./g, '')) || 1;
    const copiesNum = parseInt(certCopies.replace(/\./g, '')) || 1;
    let totalFee = 0;

    for (let copy = 1; copy <= copiesNum; copy++) {
      let copyFee = 0;
      
      // Trang 1-2: 2,000đ/trang
      const firstTwoPages = Math.min(pagesNum, 2);
      copyFee += firstTwoPages * 2000;
      
      // Từ trang 3 trở đi: 1,000đ/trang
      if (pagesNum > 2) {
        copyFee += (pagesNum - 2) * 1000;
      }
      
      // Tối đa 200,000đ/bản
      copyFee = Math.min(copyFee, 200000);
      totalFee += copyFee;
    }

    return totalFee;
  };

  // Notarized copy calculation
  const calculateNotarizedCopyFee = () => {
    const pagesNum = parseInt(notarizedPages.replace(/\./g, '')) || 1;
    const copiesNum = parseInt(notarizedCopies.replace(/\./g, '')) || 1;
    let totalFee = 0;

    for (let copy = 1; copy <= copiesNum; copy++) {
      let copyFee = 0;
      
      // Trang 1-2: 5,000đ/trang
      const firstTwoPages = Math.min(pagesNum, 2);
      copyFee += firstTwoPages * 5000;
      
      // Từ trang 3 trở đi: 3,000đ/trang
      if (pagesNum > 2) {
        copyFee += (pagesNum - 2) * 3000;
      }
      
      // Tối đa 100,000đ/bản
      copyFee = Math.min(copyFee, 100000);
      totalFee += copyFee;
    }

    return totalFee;
  };

  // Effects
  useEffect(() => {
    const transFee = calculateTranslationFee();
    const notarFee = calculateNotarizationFee();
    
    setTranslationFee(transFee);
    setNotarizationFee(notarFee);
    setTotalTranslationFee(transFee + notarFee);
  }, [direction, language, complexity, pages, copies, isSimilarContent]);

  useEffect(() => {
    const value = parseFloat(contractValue.replace(/\./g, '')) || 0;
    const service = parseFloat(serviceFee.replace(/\./g, '')) || 0;
    const copy = parseFloat(copyFee.replace(/\./g, '')) || 0;
    
    if (contractType && value > 0) {
      const notary = calculateNotaryFee(value, contractType);
      setNotaryFee(notary);
      setTotalNotaryFee(notary + service + copy);
    } else {
      setNotaryFee(0);
      setTotalNotaryFee(0);
    }
  }, [contractType, contractValue, serviceFee, copyFee]);

  useEffect(() => {
    const fee = calculateCertificationFee();
    setCertificationFee(fee);
  }, [certPages, certCopies]);

  useEffect(() => {
    const fee = calculateNotarizedCopyFee();
    setNotarizedCopyFee(fee);
  }, [notarizedPages, notarizedCopies]);

  // Utilities
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumberInput = (value) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue) {
      return new Intl.NumberFormat('vi-VN').format(numericValue);
    }
    return '';
  };

  const handleNumberInput = (value, setter) => {
    setter(formatNumberInput(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 bg-white/10 backdrop-blur rounded-lg px-3 py-2 hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Trang chủ</span>
            </button>
            
            <div className="flex items-center gap-3 flex-1 justify-center px-4">
              <Calculator className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">Công Cụ Tính Phí Công Chứng</h1>
            </div>
            
            <div className="w-20 sm:w-24"></div> {/* Spacer for balance */}
          </div>
          <p className="text-center text-blue-100 text-lg">Tính toán nhanh chóng và chính xác phí dịch thuật và công chứng</p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-xl rounded-b-2xl">
          <div className="flex flex-col md:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab('translation')}
              className={`flex items-center justify-center gap-2 py-4 px-4 font-semibold transition-all text-sm md:text-base ${
                activeTab === 'translation'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Globe className="w-5 h-5" />
              Phí Dịch Thuật & Công Chứng
            </button>
            <button
              onClick={() => setActiveTab('notary')}
              className={`flex items-center justify-center gap-2 py-4 px-4 font-semibold transition-all text-sm md:text-base ${
                activeTab === 'notary'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Scale className="w-5 h-5" />
              Phí Công Chứng Hợp Đồng
            </button>
            <button
              onClick={() => setActiveTab('certification')}
              className={`flex items-center justify-center gap-2 py-4 px-4 font-semibold transition-all text-sm md:text-base ${
                activeTab === 'certification'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileCheck className="w-5 h-5" />
              Phí Chứng Thực Bản Sao
            </button>
            <button
              onClick={() => setActiveTab('notarizedCopy')}
              className={`flex items-center justify-center gap-2 py-4 px-4 font-semibold transition-all text-sm md:text-base ${
                activeTab === 'notarizedCopy'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Copy className="w-5 h-5" />
              Phí Cấp Bản Sao Công Chứng
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Translation Tab */}
            {activeTab === 'translation' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Thông tin dịch thuật
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Hướng dịch thuật
                        </label>
                        <select
                          value={direction}
                          onChange={(e) => setDirection(e.target.value)}
                          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="to-vietnamese">Từ tiếng nước ngoài sang tiếng Việt</option>
                          <option value="from-vietnamese">Từ tiếng Việt sang tiếng nước ngoài</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ngôn ngữ
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          {Object.entries(languageNames).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Độ phức tạp
                        </label>
                        <select
                          value={complexity}
                          onChange={(e) => setComplexity(e.target.value)}
                          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="simple">Đơn giản</option>
                          <option value="complex">Phức tạp</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số trang
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={pages}
                            onChange={(e) => handleNumberInput(e.target.value, setPages)}
                            placeholder="Nhập số trang"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            trang
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số bản cần công chứng
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={copies}
                            onChange={(e) => handleNumberInput(e.target.value, setCopies)}
                            placeholder="Nhập số bản"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            bản
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="similarContent"
                          checked={isSimilarContent}
                          onChange={(e) => setIsSimilarContent(e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="similarContent" className="ml-3 text-sm text-gray-700">
                          Nội dung các trang tương tự nhau (hộ khẩu, học bạ...)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Kết quả tính toán
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Phí dịch thuật:</span>
                          <span className="text-xl font-bold">
                            {formatCurrency(translationFee)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Phí công chứng:</span>
                          <span className="text-xl font-bold">
                            {formatCurrency(notarizationFee)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/30 backdrop-blur rounded-lg p-5 border-2 border-white/50">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Tổng chi phí:</span>
                          <span className="text-2xl font-bold">
                            {formatCurrency(totalTranslationFee)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      Chi tiết tính toán:
                    </h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      <div>• Hướng dịch: {direction === 'to-vietnamese' ? 'Từ tiếng nước ngoài sang tiếng Việt' : 'Từ tiếng Việt sang tiếng nước ngoài'}</div>
                      <div>• Ngôn ngữ: {languageNames[language]}</div>
                      <div>• Độ phức tạp: {complexity === 'simple' ? 'Đơn giản' : 'Phức tạp'}</div>
                      <div>• Số trang: {parseInt(pages.replace(/\./g, '')) || 1} trang</div>
                      <div>• Số bản công chứng: {parseInt(copies.replace(/\./g, '')) || 1} bản</div>
                      <div>• Đơn giá dịch thuật: {formatCurrency(translationRates[direction][complexity][language])}/trang</div>
                      {isSimilarContent && (
                        <div className="text-orange-600">• Nội dung tương tự: áp dụng giảm 60% từ trang 2</div>
                      )}
                      {!isSimilarContent && parseInt(pages.replace(/\./g, '')) > 9 && (
                        <div className="text-orange-600">• Áp dụng giảm giá từ trang 10: {complexity === 'simple' ? '70%' : '80%'} giá gốc</div>
                      )}
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <div>• Phí dịch thuật: {formatCurrency(translationFee)}</div>
                        <div>• Phí công chứng bản dịch: {formatCurrency(notarizationFee)}</div>
                        <strong>Tổng cộng: {formatCurrency(totalTranslationFee)}</strong>
                      </div>
                      <div className="mt-3 text-xs italic">
                        * Phí dịch thuật theo QĐ số 04/2015/QĐ-UBND tỉnh Bình Dương
                        <br />
                        * Phí công chứng theo Thông tư 257/2016/TT-BTC Bộ Tài chính
                      </div>
                    </div>
                  </div>

                  {/* Fee Table Info */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Bảng phí dịch thuật:
                    </h3>
                    <div className="text-sm text-green-800 space-y-1">
                      <div className="font-semibold mb-2">{direction === 'to-vietnamese' ? 'Từ tiếng nước ngoài sang tiếng Việt:' : 'Từ tiếng Việt sang tiếng nước ngoài:'}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium underline mb-1">Văn bản đơn giản:</div>
                          <div>• Tiếng Anh, Hoa: <span className="font-medium">{formatCurrency(translationRates[direction]['simple']['english'])}/trang</span></div>
                          <div>• Tiếng Nga, Pháp: <span className="font-medium">{formatCurrency(translationRates[direction]['simple']['russian'])}/trang</span></div>
                          <div>• Tiếng Hàn, Nhật, Đức: <span className="font-medium">{formatCurrency(translationRates[direction]['simple']['korean'])}/trang</span></div>
                          <div>• Tiếng khác: <span className="font-medium">{formatCurrency(translationRates[direction]['simple']['other'])}/trang</span></div>
                        </div>
                        <div>
                          <div className="font-medium underline mb-1">Văn bản phức tạp:</div>
                          <div>• Tiếng Anh, Hoa: <span className="font-medium">{formatCurrency(translationRates[direction]['complex']['english'])}/trang</span></div>
                          <div>• Tiếng Nga, Pháp: <span className="font-medium">{formatCurrency(translationRates[direction]['complex']['russian'])}/trang</span></div>
                          <div>• Tiếng Hàn, Nhật, Đức: <span className="font-medium">{formatCurrency(translationRates[direction]['complex']['korean'])}/trang</span></div>
                          <div>• Tiếng khác: <span className="font-medium">{formatCurrency(translationRates[direction]['complex']['other'])}/trang</span></div>
                        </div>
                      </div>
                      <div className="text-orange-600 font-semibold mt-2">⚠️ Lưu ý:</div>
                      <div className="text-xs">• Một trang tối đa 350 từ (tiếng nước ngoài) hoặc 450 từ (tiếng Việt)</div>
                      <div className="text-xs">• Nội dung tương tự: giảm 60% từ trang 2</div>
                      <div className="text-xs">• Nội dung khác nhau: giảm {complexity === 'simple' ? '70%' : '80%'} từ trang 10</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notary Tab */}
            {activeTab === 'notary' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <Scale className="w-6 h-6" />
                      Thông tin hợp đồng
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Loại hợp đồng:
                        </label>
                        <select
                          value={contractType}
                          onChange={(e) => setContractType(e.target.value)}
                          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">-- Chọn loại hợp đồng --</option>
                          <option value="economic">Hợp đồng kinh tế, thương mại, đầu tư, kinh doanh</option>
                          <option value="rental">Hợp đồng thuê quyền sử dụng đất, thuê nhà ở, thuê tài sản</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Giá trị hợp đồng/giao dịch:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={contractValue}
                            onChange={(e) => handleNumberInput(e.target.value, setContractValue)}
                            placeholder="Nhập giá trị hợp đồng"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            VND
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Thù lao:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={serviceFee}
                            onChange={(e) => handleNumberInput(e.target.value, setServiceFee)}
                            placeholder="Nhập thù lao"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            VND
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phí sao y:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={copyFee}
                            onChange={(e) => handleNumberInput(e.target.value, setCopyFee)}
                            placeholder="Nhập phí sao y"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            VND
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                                  {/* Results */}
                <div className="space-y-6">
                  {(contractType && parseFloat(contractValue.replace(/\./g, '')) > 0) && (
                    <>
                      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg animate-fadeIn">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <FileText className="w-6 h-6" />
                          Kết quả tính toán
                        </h2>
                        
                        <div className="space-y-4">
                          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Phí công chứng:</span>
                              <span className="text-xl font-bold">
                                {formatCurrency(notaryFee)}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Thù lao:</span>
                              <span className="text-xl font-bold">
                                {formatCurrency(parseFloat(serviceFee.replace(/\./g, '')) || 0)}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Phí sao y:</span>
                              <span className="text-xl font-bold">
                                {formatCurrency(parseFloat(copyFee.replace(/\./g, '')) || 0)}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/30 backdrop-blur rounded-lg p-5 border-2 border-white/50">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold">TỔNG PHÍ PHẢI THANH TOÁN:</span>
                              <span className="text-2xl font-bold">
                                {formatCurrency(totalNotaryFee)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Calculation Details */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                          <ChevronRight className="w-5 h-5" />
                          Chi tiết tính toán:
                        </h3>
                        <div className="text-sm text-blue-800 space-y-2">
                          <div>• Loại hợp đồng: {contractType === 'economic' ? 'Kinh tế, thương mại, đầu tư, kinh doanh' : 'Thuê quyền sử dụng đất, thuê nhà ở, thuê tài sản'}</div>
                          <div>• Giá trị hợp đồng: {formatCurrency(parseFloat(contractValue.replace(/\./g, '')) || 0)}</div>
                          {(() => {
                            const value = parseFloat(contractValue.replace(/\./g, '')) || 0;
                            const feeTable = contractType === 'economic' ? economicFees : rentalFees;
                            let tier = null;
                            
                            for (let t of feeTable) {
                              if (value >= t.min && value <= t.max) {
                                tier = t;
                                break;
                              }
                            }
                            
                            if (tier) {
                              if (tier.fee) {
                                return <div>• Mức áp dụng: {formatCurrency(tier.fee)} (mức cố định)</div>;
                              } else if (tier.rate) {
                                return <div>• Mức áp dụng: {tier.base ? formatCurrency(tier.base) + ' + ' : ''}{(tier.rate * 100).toFixed(2)}% {tier.base ? 'phần vượt' : 'giá trị hợp đồng'}</div>;
                              }
                            }
                            return null;
                          })()}
                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <div>• Phí công chứng: {formatCurrency(notaryFee)}</div>
                            {parseFloat(serviceFee.replace(/\./g, '')) > 0 && (
                              <div>• Thù lao: {formatCurrency(parseFloat(serviceFee.replace(/\./g, '')) || 0)}</div>
                            )}
                            {parseFloat(copyFee.replace(/\./g, '')) > 0 && (
                              <div>• Phí sao y: {formatCurrency(parseFloat(copyFee.replace(/\./g, '')) || 0)}</div>
                            )}
                            <strong>Tổng cộng: {formatCurrency(totalNotaryFee)}</strong>
                          </div>
                          {(() => {
                            const value = parseFloat(contractValue.replace(/\./g, '')) || 0;
                            const maxFee = contractType === 'economic' ? 70000000 : 8000000;
                            if (notaryFee === maxFee) {
                              return <div className="text-orange-600 font-semibold mt-2">⚠️ Đã áp dụng mức phí tối đa: {formatCurrency(maxFee)}</div>;
                            }
                            return null;
                          })()}
                          <div className="mt-3 text-xs italic">
                            * Áp dụng theo Thông tư 257/2016/TT-BTC Bộ Tài chính
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Fee Table Info */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-5">
                    <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <Scale className="w-5 h-5" />
                      Bảng phí công chứng hợp đồng:
                    </h3>
                    {contractType === 'economic' ? (
                      <div className="text-sm text-indigo-800 space-y-1">
                        <div className="font-semibold mb-2">Hợp đồng kinh tế, thương mại, đầu tư, kinh doanh:</div>
                        <div>• Dưới 50 triệu: <span className="font-medium">50,000 VND</span></div>
                        <div>• 50-100 triệu: <span className="font-medium">100,000 VND</span></div>
                        <div>• 100 triệu - 1 tỷ: <span className="font-medium">0.1% giá trị</span></div>
                        <div>• 1-3 tỷ: <span className="font-medium">1 triệu + 0.06% phần vượt 1 tỷ</span></div>
                        <div>• 3-5 tỷ: <span className="font-medium">2.2 triệu + 0.05% phần vượt 3 tỷ</span></div>
                        <div>• 5-10 tỷ: <span className="font-medium">3.2 triệu + 0.04% phần vượt 5 tỷ</span></div>
                        <div>• 10-100 tỷ: <span className="font-medium">5.2 triệu + 0.03% phần vượt 10 tỷ</span></div>
                        <div>• Trên 100 tỷ: <span className="font-medium">32.2 triệu + 0.02% phần vượt 100 tỷ</span></div>
                        <div className="text-orange-600 font-semibold mt-2">⚠️ Mức thu tối đa: 70,000,000 VND</div>
                      </div>
                    ) : contractType === 'rental' ? (
                      <div className="text-sm text-indigo-800 space-y-1">
                        <div className="font-semibold mb-2">Hợp đồng thuê (đất, nhà, tài sản):</div>
                        <div>• Dưới 50 triệu: <span className="font-medium">40,000 VND</span></div>
                        <div>• 50-100 triệu: <span className="font-medium">80,000 VND</span></div>
                        <div>• 100 triệu - 1 tỷ: <span className="font-medium">0.08% giá trị</span></div>
                        <div>• 1-3 tỷ: <span className="font-medium">800 nghìn + 0.06% phần vượt 1 tỷ</span></div>
                        <div>• 3-5 tỷ: <span className="font-medium">2 triệu + 0.05% phần vượt 3 tỷ</span></div>
                        <div>• 5-10 tỷ: <span className="font-medium">3 triệu + 0.04% phần vượt 5 tỷ</span></div>
                        <div>• Trên 10 tỷ: <span className="font-medium">5 triệu + 0.03% phần vượt 10 tỷ</span></div>
                        <div className="text-orange-600 font-semibold mt-2">⚠️ Mức thu tối đa: 8,000,000 VND</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Vui lòng chọn loại hợp đồng để xem bảng phí chi tiết
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Certification Tab */}
            {activeTab === 'certification' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <FileCheck className="w-6 h-6" />
                      Thông tin chứng thực
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số trang cần chứng thực
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={certPages}
                            onChange={(e) => handleNumberInput(e.target.value, setCertPages)}
                            placeholder="Nhập số trang"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            trang
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số bản cần chứng thực
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={certCopies}
                            onChange={(e) => handleNumberInput(e.target.value, setCertCopies)}
                            placeholder="Nhập số bản"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            bản
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Structure Info */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <Copy className="w-5 h-5" />
                      Cơ cấu phí chứng thực:
                    </h3>
                    <div className="text-sm text-green-800 space-y-2">
                      <div>• Trang 1-2: <span className="font-semibold">2,000 VND/trang</span></div>
                      <div>• Từ trang 3 trở đi: <span className="font-semibold">1,000 VND/trang</span></div>
                      <div>• Mức thu tối đa: <span className="font-semibold">200,000 VND/bản</span></div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Kết quả tính toán
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Số trang:</span>
                          <span className="text-xl font-bold">
                            {parseInt(certPages.replace(/\./g, '')) || 1} trang
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Số bản:</span>
                          <span className="text-xl font-bold">
                            {parseInt(certCopies.replace(/\./g, '')) || 1} bản
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/30 backdrop-blur rounded-lg p-5 border-2 border-white/50">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Tổng phí chứng thực:</span>
                          <span className="text-2xl font-bold">
                            {formatCurrency(certificationFee)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Details */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      Chi tiết tính toán:
                    </h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      {(() => {
                        const pagesNum = parseInt(certPages.replace(/\./g, '')) || 1;
                        const copiesNum = parseInt(certCopies.replace(/\./g, '')) || 1;
                        
                        if (copiesNum <= 5) {
                          // Hiển thị chi tiết từng bản nếu <= 5 bản
                          let details = [];
                          
                          for (let i = 1; i <= copiesNum; i++) {
                            let copyFee = 0;
                            const firstTwo = Math.min(pagesNum, 2);
                            copyFee += firstTwo * 2000;
                            
                            if (pagesNum > 2) {
                              copyFee += (pagesNum - 2) * 1000;
                            }
                            
                            const actualFee = Math.min(copyFee, 200000);
                            const hitMax = copyFee > 200000;
                            
                            details.push(
                              <div key={i}>
                                • Bản {i}: {formatCurrency(actualFee)} 
                                {hitMax && <span className="text-orange-600"> (đã áp dụng mức tối đa)</span>}
                              </div>
                            );
                          }
                          
                          return details;
                        } else {
                          // Hiển thị tóm tắt nếu > 5 bản
                          let copyFee = 0;
                          const firstTwo = Math.min(pagesNum, 2);
                          copyFee += firstTwo * 2000;
                          
                          if (pagesNum > 2) {
                            copyFee += (pagesNum - 2) * 1000;
                          }
                          
                          const actualFee = Math.min(copyFee, 200000);
                          const hitMax = copyFee > 200000;
                          
                          return (
                            <>
                              <div>• Số bản: {copiesNum} bản</div>
                              <div>• Phí mỗi bản: {formatCurrency(actualFee)} {hitMax && <span className="text-orange-600">(đã áp dụng mức tối đa)</span>}</div>
                              <div>• Chi tiết tính phí 1 bản:</div>
                              <div className="ml-4 text-xs">
                                - Trang 1-2: {Math.min(pagesNum, 2)} trang × 2,000 = {formatCurrency(Math.min(pagesNum, 2) * 2000)}
                                {pagesNum > 2 && (
                                  <>
                                    <br />
                                    - Từ trang 3: {pagesNum - 2} trang × 1,000 = {formatCurrency((pagesNum - 2) * 1000)}
                                  </>
                                )}
                                {hitMax && (
                                  <>
                                    <br />
                                    - Tổng: {formatCurrency(copyFee)} → Áp dụng mức tối đa: {formatCurrency(200000)}
                                  </>
                                )}
                              </div>
                            </>
                          );
                        }
                      })()}
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <strong>Tổng cộng: {formatCurrency(certificationFee)}</strong>
                      </div>
                      <div className="mt-3 text-xs italic">
                        * Áp dụng theo Thông tư 257/2016/TT-BTC Bộ Tài chính
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notarized Copy Tab */}
            {activeTab === 'notarizedCopy' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <Copy className="w-6 h-6" />
                      Thông tin bản sao công chứng
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số trang văn bản công chứng
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={notarizedPages}
                            onChange={(e) => handleNumberInput(e.target.value, setNotarizedPages)}
                            placeholder="Nhập số trang"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            trang
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số bản sao cần cấp
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={notarizedCopies}
                            onChange={(e) => handleNumberInput(e.target.value, setNotarizedCopies)}
                            placeholder="Nhập số bản"
                            className="w-full p-3 pr-16 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            bản
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Structure Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Cơ cấu phí cấp bản sao:
                    </h3>
                    <div className="text-sm text-purple-800 space-y-2">
                      <div>• Trang 1-2: <span className="font-semibold">5,000 VND/trang</span></div>
                      <div>• Từ trang 3 trở đi: <span className="font-semibold">3,000 VND/trang</span></div>
                      <div>• Mức thu tối đa: <span className="font-semibold">100,000 VND/bản</span></div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Kết quả tính toán
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Số trang:</span>
                          <span className="text-xl font-bold">
                            {parseInt(notarizedPages.replace(/\./g, '')) || 1} trang
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Số bản sao:</span>
                          <span className="text-xl font-bold">
                            {parseInt(notarizedCopies.replace(/\./g, '')) || 1} bản
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/30 backdrop-blur rounded-lg p-5 border-2 border-white/50">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Tổng phí cấp bản sao:</span>
                          <span className="text-2xl font-bold">
                            {formatCurrency(notarizedCopyFee)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Details */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      Chi tiết tính toán:
                    </h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      {(() => {
                        const pagesNum = parseInt(notarizedPages.replace(/\./g, '')) || 1;
                        const copiesNum = parseInt(notarizedCopies.replace(/\./g, '')) || 1;
                        
                        if (copiesNum <= 5) {
                          // Hiển thị chi tiết từng bản nếu <= 5 bản
                          let details = [];
                          
                          for (let i = 1; i <= copiesNum; i++) {
                            let copyFee = 0;
                            const firstTwo = Math.min(pagesNum, 2);
                            copyFee += firstTwo * 5000;
                            
                            if (pagesNum > 2) {
                              copyFee += (pagesNum - 2) * 3000;
                            }
                            
                            const actualFee = Math.min(copyFee, 100000);
                            const hitMax = copyFee > 100000;
                            
                            details.push(
                              <div key={i}>
                                • Bản sao {i}: {formatCurrency(actualFee)} 
                                {hitMax && <span className="text-orange-600"> (đã áp dụng mức tối đa)</span>}
                              </div>
                            );
                          }
                          
                          return details;
                        } else {
                          // Hiển thị tóm tắt nếu > 5 bản
                          let copyFee = 0;
                          const firstTwo = Math.min(pagesNum, 2);
                          copyFee += firstTwo * 5000;
                          
                          if (pagesNum > 2) {
                            copyFee += (pagesNum - 2) * 3000;
                          }
                          
                          const actualFee = Math.min(copyFee, 100000);
                          const hitMax = copyFee > 100000;
                          
                          return (
                            <>
                              <div>• Số bản sao: {copiesNum} bản</div>
                              <div>• Phí mỗi bản: {formatCurrency(actualFee)} {hitMax && <span className="text-orange-600">(đã áp dụng mức tối đa)</span>}</div>
                              <div>• Chi tiết tính phí 1 bản:</div>
                              <div className="ml-4 text-xs">
                                - Trang 1-2: {Math.min(pagesNum, 2)} trang × 5,000 = {formatCurrency(Math.min(pagesNum, 2) * 5000)}
                                {pagesNum > 2 && (
                                  <>
                                    <br />
                                    - Từ trang 3: {pagesNum - 2} trang × 3,000 = {formatCurrency((pagesNum - 2) * 3000)}
                                  </>
                                )}
                                {hitMax && (
                                  <>
                                    <br />
                                    - Tổng: {formatCurrency(copyFee)} → Áp dụng mức tối đa: {formatCurrency(100000)}
                                  </>
                                )}
                              </div>
                            </>
                          );
                        }
                      })()}
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <strong>Tổng cộng: {formatCurrency(notarizedCopyFee)}</strong>
                      </div>
                      <div className="mt-3 text-xs italic">
                        * Áp dụng theo Thông tư 257/2016/TT-BTC Bộ Tài chính
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default UnifiedFeeCalculator;
