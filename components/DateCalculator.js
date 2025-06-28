import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Minus, Calculator, ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const DateCalculator = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('add-time');
  
  // Add Time states
  const [startDate, setStartDate] = useState('');
  const [addDays, setAddDays] = useState('');
  const [addMonths, setAddMonths] = useState('');
  const [addYears, setAddYears] = useState('');
  const [resultDate, setResultDate] = useState('');
  
  // Date Difference states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [daysDifference, setDaysDifference] = useState(0);
  const [monthsDifference, setMonthsDifference] = useState(0);
  const [yearsDifference, setYearsDifference] = useState(0);
  
  // Working Days states
  const [workFromDate, setWorkFromDate] = useState('');
  const [workToDate, setWorkToDate] = useState('');
  const [workingDays, setWorkingDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [weekendDays, setWeekendDays] = useState(0);
  const [holidayDays, setHolidayDays] = useState(0);

  // Danh sách ngày lễ Việt Nam (có thể cấu hình)
  const vietnamHolidays = [
    // 2024
    '2024-01-01', // Tết Dương lịch
    '2024-02-08', '2024-02-09', '2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13', '2024-02-14', // Tết Nguyên đán
    '2024-04-18', // Giỗ tổ Hùng Vương
    '2024-04-29', '2024-04-30', '2024-05-01', // 30/4 - 1/5
    '2024-09-02', // Quốc Khánh
    
    // 2025
    '2025-01-01', // Tết Dương lịch
    '2025-01-27', '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31', '2025-02-01', '2025-02-02', // Tết Nguyên đán 2025
    '2025-04-18', // Giỗ tổ Hùng Vương
    '2025-04-29', '2025-04-30', '2025-05-01', // 30/4 - 1/5
    '2025-09-02', // Quốc Khánh
    
    // 2026
    '2026-01-01', // Tết Dương lịch
    '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22', // Tết Nguyên đán 2026
    '2026-04-18', // Giỗ tổ Hùng Vương
    '2026-04-29', '2026-04-30', '2026-05-01', // 30/4 - 1/5
    '2026-09-02', // Quốc Khánh
  ];

  // Quick preset buttons data
  const presetPeriods = [
    { label: '30 ngày', days: 30, months: 0, years: 0 },
    { label: '45 ngày', days: 45, months: 0, years: 0 },
    { label: '60 ngày', days: 60, months: 0, years: 0 },
    { label: '90 ngày', days: 90, months: 0, years: 0 },
    { label: '6 tháng', days: 0, months: 6, years: 0 },
    { label: '1 năm', days: 0, months: 0, years: 1 },
    { label: '2 năm', days: 0, months: 0, years: 2 },
    { label: '3 năm', days: 0, months: 0, years: 3 },
  ];

  // Utility functions
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  };

  const formatShortDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return new Intl.DateTimeFormat('vi-VN').format(d);
  };

  const isHoliday = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return vietnamHolidays.includes(dateStr);
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  const isWorkingDay = (date) => {
    return !isWeekend(date) && !isHoliday(date);
  };

  // Add time calculation
  const calculateAddTime = () => {
    if (!startDate) return;
    
    const start = new Date(startDate);
    const result = new Date(start);
    
    // Add years first
    if (addYears) {
      result.setFullYear(result.getFullYear() + parseInt(addYears));
    }
    
    // Add months
    if (addMonths) {
      result.setMonth(result.getMonth() + parseInt(addMonths));
    }
    
    // Add days
    if (addDays) {
      result.setDate(result.getDate() + parseInt(addDays));
    }
    
    setResultDate(result.toISOString().split('T')[0]);
  };

  // Date difference calculation
  const calculateDateDifference = () => {
    if (!fromDate || !toDate) return;
    
    const start = new Date(fromDate);
    const end = new Date(toDate);
    
    if (end < start) {
      setDaysDifference(0);
      setMonthsDifference(0);
      setYearsDifference(0);
      return;
    }
    
    // Calculate total days
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDaysDifference(days);
    
    // Calculate years and months
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (end.getDate() < start.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }
    
    setYearsDifference(years);
    setMonthsDifference(months);
  };

  // Working days calculation
  const calculateWorkingDays = () => {
    if (!workFromDate || !workToDate) return;
    
    const start = new Date(workFromDate);
    const end = new Date(workToDate);
    
    if (end < start) {
      setWorkingDays(0);
      setTotalDays(0);
      setWeekendDays(0);
      setHolidayDays(0);
      return;
    }
    
    let current = new Date(start);
    let working = 0;
    let weekends = 0;
    let holidays = 0;
    let total = 0;
    
    while (current <= end) {
      total++;
      
      if (isHoliday(current)) {
        holidays++;
      } else if (isWeekend(current)) {
        weekends++;
      } else {
        working++;
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    setWorkingDays(working);
    setTotalDays(total);
    setWeekendDays(weekends);
    setHolidayDays(holidays);
  };

  // Quick preset handler
  const applyPreset = (preset) => {
    setAddDays(preset.days.toString());
    setAddMonths(preset.months.toString());
    setAddYears(preset.years.toString());
  };

  // Set today as default
  const setToday = (setter) => {
    const today = new Date().toISOString().split('T')[0];
    setter(today);
  };

  // Effects
  useEffect(() => {
    calculateAddTime();
  }, [startDate, addDays, addMonths, addYears]);

  useEffect(() => {
    calculateDateDifference();
  }, [fromDate, toDate]);

  useEffect(() => {
    calculateWorkingDays();
  }, [workFromDate, workToDate]);

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
              <span className="text-sm font-medium">Trang chủ</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-10 h-10" />
              <h1 className="text-3xl md:text-4xl font-bold">Tính Thời Hạn Giấy Tờ</h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
          <p className="text-center text-blue-100 text-lg">Công cụ tính toán thời gian và thời hạn hiệu lực văn bản</p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-xl rounded-b-2xl">
          <div className="flex flex-col md:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab('add-time')}
              className={`flex items-center justify-center gap-2 py-4 px-4 font-semibold transition-all text-sm md:text-base ${
                activeTab === 'add-time'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-5 h-5" />
              Cộng Thời Gian
            </button>
            <button
              onClick={() => setActiveTab('date-diff')}
              className={`flex items-center justify-center gap-2 py-4 px-4 font-semibold transition-all text-sm md:text-base ${
                activeTab === 'date-diff'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Minus className="w-5 h-5" />
              Tính Khoảng Cách
            </button>
            <button
              onClick={() => setActiveTab('working-days')}
              className={`flex items-center justify-center gap-2 py-4 px-4 font-semibold transition-all text-sm md:text-base ${
                activeTab === 'working-days'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-5 h-5" />
              Ngày Làm Việc
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Add Time Tab */}
            {activeTab === 'add-time' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <Plus className="w-6 h-6" />
                      Cộng thời gian từ ngày cụ thể
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ngày bắt đầu
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <button
                            onClick={() => setToday(setStartDate)}
                            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Hôm nay
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thêm ngày
                          </label>
                          <input
                            type="number"
                            value={addDays}
                            onChange={(e) => setAddDays(e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thêm tháng
                          </label>
                          <input
                            type="number"
                            value={addMonths}
                            onChange={(e) => setAddMonths(e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thêm năm
                          </label>
                          <input
                            type="number"
                            value={addYears}
                            onChange={(e) => setAddYears(e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Mốc thời gian thông dụng:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {presetPeriods.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => applyPreset(preset)}
                          className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-medium transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  {startDate && resultDate && (
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Kết quả tính toán
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Ngày bắt đầu:</div>
                          <div className="text-lg font-bold">{formatDate(startDate)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(startDate)}</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Thời gian cộng thêm:</div>
                          <div className="text-lg font-bold">
                            {[
                              addYears && `${addYears} năm`,
                              addMonths && `${addMonths} tháng`, 
                              addDays && `${addDays} ngày`
                            ].filter(Boolean).join(', ') || 'Không có'}
                          </div>
                        </div>

                        <div className="bg-white/30 backdrop-blur rounded-lg p-5 border-2 border-white/50">
                          <div className="text-sm font-medium mb-1">Ngày kết quả:</div>
                          <div className="text-2xl font-bold">{formatDate(resultDate)}</div>
                          <div className="text-lg text-blue-100 mt-1">{formatShortDate(resultDate)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      Ví dụ sử dụng:
                    </h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      <div>• Tính thời hạn hiệu lực hộ chiếu (10 năm từ ngày cấp)</div>
                      <div>• Tính hạn nộp thuế (30 ngày từ ngày ký hợp đồng)</div>
                      <div>• Tính thời hạn khiếu nại (60 ngày từ ngày có quyết định)</div>
                      <div>• Tính thời hạn bảo hành (2 năm từ ngày mua)</div>
                      <div>• Tính ngày hết hạn visa (90 ngày từ ngày nhập cảnh)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date Difference Tab */}
            {activeTab === 'date-diff' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <Minus className="w-6 h-6" />
                      Tính khoảng cách giữa hai mốc thời gian
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Từ ngày
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <button
                            onClick={() => setToday(setFromDate)}
                            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Hôm nay
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Đến ngày
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <button
                            onClick={() => setToday(setToDate)}
                            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Hôm nay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  {fromDate && toDate && (
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Kết quả tính toán
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Từ ngày:</div>
                          <div className="text-lg font-bold">{formatDate(fromDate)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(fromDate)}</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Đến ngày:</div>
                          <div className="text-lg font-bold">{formatDate(toDate)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(toDate)}</div>
                        </div>

                        <div className="bg-white/30 backdrop-blur rounded-lg p-5 border-2 border-white/50">
                          <div className="text-sm font-medium mb-2">Khoảng cách thời gian:</div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold">{daysDifference} ngày</div>
                            {(yearsDifference > 0 || monthsDifference > 0) && (
                              <div className="text-lg text-blue-100">
                                {yearsDifference > 0 && `${yearsDifference} năm `}
                                {monthsDifference > 0 && `${monthsDifference} tháng`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      Ví dụ sử dụng:
                    </h3>
                    <div className="text-sm text-purple-800 space-y-2">
                      <div>• Tính tuổi từ ngày sinh đến hiện tại</div>
                      <div>• Tính thời gian làm việc tại công ty</div>
                      <div>• Tính thời gian còn lại đến hạn nộp hồ sơ</div>
                      <div>• Tính khoảng cách giữa hai sự kiện</div>
                      <div>• Tính thời gian trễ hạn nộp thuế</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Working Days Tab */}
            {activeTab === 'working-days' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <Clock className="w-6 h-6" />
                      Tính ngày làm việc (trừ T7, CN, lễ)
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Từ ngày
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={workFromDate}
                            onChange={(e) => setWorkFromDate(e.target.value)}
                            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <button
                            onClick={() => setToday(setWorkFromDate)}
                            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Hôm nay
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Đến ngày
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={workToDate}
                            onChange={(e) => setWorkToDate(e.target.value)}
                            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <button
                            onClick={() => setToday(setWorkToDate)}
                            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Hôm nay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Holiday Info */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5">
                    <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Ngày lễ được tính:
                    </h3>
                    <div className="text-sm text-amber-800 space-y-1">
                      <div>• Tết Dương lịch (01/01)</div>
                      <div>• Tết Nguyên đán (7 ngày)</div>
                      <div>• Giỗ tổ Hùng Vương (10/03 âm lịch)</div>
                      <div>• Ngày Giải phóng (30/04)</div>
                      <div>• Ngày Quốc tế Lao động (01/05)</div>
                      <div>• Ngày Quốc khánh (02/09)</div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  {workFromDate && workToDate && (
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Kết quả tính toán
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Từ ngày:</div>
                          <div className="text-lg font-bold">{formatDate(workFromDate)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(workFromDate)}</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Đến ngày:</div>
                          <div className="text-lg font-bold">{formatDate(workToDate)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(workToDate)}</div>
                        </div>

                        <div className="bg-white/30 backdrop-blur rounded-lg p-5 border-2 border-white/50">
                          <div className="text-sm font-medium mb-2">Ngày làm việc:</div>
                          <div className="text-3xl font-bold text-center">{workingDays} ngày</div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                            <div className="text-sm font-medium">Tổng số ngày</div>
                            <div className="text-xl font-bold">{totalDays}</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                            <div className="text-sm font-medium">Cuối tuần</div>
                            <div className="text-xl font-bold">{weekendDays}</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                            <div className="text-sm font-medium">Ngày lễ</div>
                            <div className="text-xl font-bold">{holidayDays}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Calculation Details */}
                  {workFromDate && workToDate && totalDays > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <ChevronRight className="w-5 h-5" />
                        Chi tiết tính toán:
                      </h3>
                      <div className="text-sm text-blue-800 space-y-2">
                        <div>• Tổng số ngày: {totalDays} ngày</div>
                        <div>• Ngày cuối tuần (T7, CN): {weekendDays} ngày</div>
                        <div>• Ngày lễ: {holidayDays} ngày</div>
                        <div>• Ngày làm việc: {workingDays} ngày</div>
                        <div className="mt-2 pt-2 border-t border-blue-200 text-blue-900 font-semibold">
                          Công thức: {totalDays} - {weekendDays} - {holidayDays} = {workingDays} ngày làm việc
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      Ví dụ sử dụng:
                    </h3>
                    <div className="text-sm text-green-800 space-y-2">
                      <div>• Tính thời hạn xử lý hồ sơ hành chính (15 ngày làm việc)</div>
                      <div>• Tính thời gian nghỉ phép trong tháng</div>
                      <div>• Tính số ngày làm việc để hoàn thành dự án</div>
                      <div>• Tính thời hạn phúc thẩm (30 ngày làm việc)</div>
                      <div>• Tính thời gian xử lý khiếu nại (60 ngày làm việc)</div>
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
              <Calendar className="w-5 h-5" />
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

export default DateCalculator;
