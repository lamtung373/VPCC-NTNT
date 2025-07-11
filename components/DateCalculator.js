import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Minus, Calculator, ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const DateCalculator = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('add-time');
  
  // Add Time states
  const [startDate, setStartDate] = useState('');
  const [startDateDisplay, setStartDateDisplay] = useState('');
  const [addDays, setAddDays] = useState('');
  const [addMonths, setAddMonths] = useState('');
  const [addYears, setAddYears] = useState('');
  const [resultDate, setResultDate] = useState('');
  const [excludeWeekendsAdd, setExcludeWeekendsAdd] = useState(false);
  const [excludeHolidaysAdd, setExcludeHolidaysAdd] = useState(false);
  
  // Date Difference states
  const [fromDate, setFromDate] = useState('');
  const [fromDateDisplay, setFromDateDisplay] = useState('');
  const [toDate, setToDate] = useState('');
  const [toDateDisplay, setToDateDisplay] = useState('');
  const [daysDifference, setDaysDifference] = useState(0);
  const [monthsDifference, setMonthsDifference] = useState(0);
  const [yearsDifference, setYearsDifference] = useState(0);
  const [excludeWeekendsDiff, setExcludeWeekendsDiff] = useState(false);
  const [excludeHolidaysDiff, setExcludeHolidaysDiff] = useState(false);
  
  // Working Days states
  const [workFromDate, setWorkFromDate] = useState('');
  const [workFromDateDisplay, setWorkFromDateDisplay] = useState('');
  const [workToDate, setWorkToDate] = useState('');
  const [workToDateDisplay, setWorkToDateDisplay] = useState('');
  const [workingDays, setWorkingDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [weekendDays, setWeekendDays] = useState(0);
  const [holidayDays, setHolidayDays] = useState(0);

  // Danh sách ngày lễ Việt Nam cố định (không phụ thuộc năm cụ thể)
  const getVietnamHolidays = (year) => {
    const holidays = [];
    
    // Ngày lễ cố định
    holidays.push(`${year}-01-01`); // Tết Dương lịch
    holidays.push(`${year}-04-30`); // Ngày Giải phóng miền Nam
    holidays.push(`${year}-05-01`); // Ngày Quốc tế Lao động
    holidays.push(`${year}-09-02`); // Ngày Quốc khánh
    
    // Tết Nguyên đán (7 ngày) - cần tính theo âm lịch
    // Đây là xấp xỉ, trong thực tế cần dùng thư viện chuyển đổi lịch
    const tetDates = getTetDates(year);
    holidays.push(...tetDates);
    
    // Giỗ tổ Hùng Vương (10/3 âm lịch) - xấp xỉ
    const hungKingDate = getHungKingDate(year);
    if (hungKingDate) holidays.push(hungKingDate);
    
    return holidays;
  };

  // Hàm tính ngày Tết (xấp xỉ - trong thực tế cần dùng thư viện chuyển đổi lịch)
  const getTetDates = (year) => {
    const tetDates = {
      2024: ['2024-02-08', '2024-02-09', '2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13', '2024-02-14'],
      2025: ['2025-01-27', '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31', '2025-02-01', '2025-02-02'],
      2026: ['2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22'],
      2027: ['2027-02-05', '2027-02-06', '2027-02-07', '2027-02-08', '2027-02-09', '2027-02-10', '2027-02-11'],
      2028: ['2028-01-25', '2028-01-26', '2028-01-27', '2028-01-28', '2028-01-29', '2028-01-30', '2028-01-31'],
    };
    return tetDates[year] || [];
  };

  // Hàm tính ngày Giỗ tổ Hùng Vương (xấp xỉ)
  const getHungKingDate = (year) => {
    const hungKingDates = {
      2024: '2024-04-18',
      2025: '2025-04-07',
      2026: '2026-04-26',
      2027: '2027-04-16',
      2028: '2028-04-04',
    };
    return hungKingDates[year];
  };

  // Quick preset buttons data
  const presetPeriods = [
    { label: '7 ngày', days: 7, months: 0, years: 0 },
    { label: '10 ngày', days: 10, months: 0, years: 0 },
    { label: '15 ngày', days: 15, months: 0, years: 0 },
    { label: '20 ngày', days: 20, months: 0, years: 0 },
    { label: '30 ngày', days: 30, months: 0, years: 0 },
    { label: '45 ngày', days: 45, months: 0, years: 0 },
    { label: '60 ngày', days: 60, months: 0, years: 0 },
    { label: '90 ngày', days: 90, months: 0, years: 0 },
    { label: '3 tháng', days: 0, months: 3, years: 0 },
    { label: '6 tháng', days: 0, months: 6, years: 0 },
    { label: '9 tháng', days: 0, months: 9, years: 0 },
    { label: '1 năm', days: 0, months: 0, years: 1 },
    { label: '2 năm', days: 0, months: 0, years: 2 },
    { label: '3 năm', days: 0, months: 0, years: 3 },
    { label: '5 năm', days: 0, months: 0, years: 5 },
    { label: '10 năm', days: 0, months: 0, years: 10 },
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
    const year = date.getFullYear();
    const holidays = getVietnamHolidays(year);
    const dateStr = date.toISOString().split('T')[0];
    return holidays.includes(dateStr);
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  const isWorkingDay = (date, excludeWeekends = true, excludeHolidays = true) => {
    if (excludeWeekends && isWeekend(date)) return false;
    if (excludeHolidays && isHoliday(date)) return false;
    return true;
  };

  // Add working days to a date
  const addWorkingDays = (startDate, daysToAdd, excludeWeekends, excludeHolidays) => {
    if (!excludeWeekends && !excludeHolidays) {
      // If not excluding anything, just add days normally
      const result = new Date(startDate);
      result.setDate(result.getDate() + daysToAdd);
      return result;
    }

    let current = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < daysToAdd) {
      current.setDate(current.getDate() + 1);
      if (isWorkingDay(current, excludeWeekends, excludeHolidays)) {
        addedDays++;
      }
    }
    
    return current;
  };

  // Format date input as DD/MM/YYYY
  const formatDateInput = (input) => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');
    
    // Limit to 8 digits
    const limited = numbers.slice(0, 8);
    
    // Add slashes at appropriate positions
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i === 2 || i === 4) {
        formatted += '/';
      }
      formatted += limited[i];
    }
    
    return formatted;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for date calculations
  const convertToISODate = (ddmmyyyy) => {
    const numbers = ddmmyyyy.replace(/\D/g, '');
    if (numbers.length === 8) {
      const day = numbers.slice(0, 2);
      const month = numbers.slice(2, 4);
      const year = numbers.slice(4, 8);
      
      // Validate date
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() == year && 
          date.getMonth() == month - 1 && 
          date.getDate() == day) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return '';
  };

  // Handle date input with auto-formatting
  const handleDateInput = (value, displaySetter, dateSetter) => {
    const formatted = formatDateInput(value);
    displaySetter(formatted);
    
    // Convert to ISO format if complete
    const isoDate = convertToISODate(formatted);
    if (isoDate) {
      dateSetter(isoDate);
    } else if (formatted.replace(/\D/g, '').length < 8) {
      dateSetter(''); // Clear if incomplete
    }
  };

  // Add time calculation
  const calculateAddTime = () => {
    if (!startDate) return;
    
    const start = new Date(startDate);
    let result = new Date(start);
    
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
      const daysToAdd = parseInt(addDays);
      if (excludeWeekendsAdd || excludeHolidaysAdd) {
        result = addWorkingDays(result, daysToAdd, excludeWeekendsAdd, excludeHolidaysAdd);
      } else {
        result.setDate(result.getDate() + daysToAdd);
      }
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
    
    if (excludeWeekendsDiff || excludeHolidaysDiff) {
      // Count working days
      let current = new Date(start);
      let workingDays = 0;
      
      while (current <= end) {
        if (isWorkingDay(current, excludeWeekendsDiff, excludeHolidaysDiff)) {
          workingDays++;
        }
        current.setDate(current.getDate() + 1);
      }
      
      setDaysDifference(workingDays);
    } else {
      // Calculate total days
      const timeDiff = end.getTime() - start.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysDifference(days);
    }
    
    // Calculate years and months (always calendar-based)
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
  const setToday = (displaySetter, dateSetter) => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    
    const displayFormat = `${day}/${month}/${year}`;
    const isoFormat = `${year}-${month}-${day}`;
    
    displaySetter(displayFormat);
    dateSetter(isoFormat);
  };

  // Effects
  useEffect(() => {
    calculateAddTime();
  }, [startDate, addDays, addMonths, addYears, excludeWeekendsAdd, excludeHolidaysAdd]);

  useEffect(() => {
    calculateDateDifference();
  }, [fromDate, toDate, excludeWeekendsDiff, excludeHolidaysDiff]);

  useEffect(() => {
    calculateWorkingDays();
  }, [workFromDate, workToDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-4 sm:p-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 bg-white/10 backdrop-blur rounded-lg px-2 sm:px-3 py-2 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Trang chủ</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center px-2 sm:px-4">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center">Công Cụ Tính Toán Thời Gian</h1>
            </div>
            
            <div className="w-12 sm:w-20 sm:w-24"></div> {/* Spacer for balance */}
          </div>
          <p className="text-center text-blue-100 text-sm sm:text-lg">Tính toán thời gian và thời hạn hiệu lực văn bản chính xác</p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-xl rounded-b-2xl">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab('add-time')}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 font-semibold transition-all text-xs sm:text-sm md:text-base ${
                activeTab === 'add-time'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Cộng Thời Gian</span>
            </button>
            <button
              onClick={() => setActiveTab('date-diff')}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 font-semibold transition-all text-xs sm:text-sm md:text-base ${
                activeTab === 'date-diff'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Tính Khoảng Cách</span>
            </button>
            <button
              onClick={() => setActiveTab('working-days')}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 font-semibold transition-all text-xs sm:text-sm md:text-base ${
                activeTab === 'working-days'
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Ngày Làm Việc</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Add Time Tab */}
            {activeTab === 'add-time' && (
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Input Form */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-200">
                    <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6 flex items-center gap-2">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                      Cộng thời gian từ ngày cụ thể
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ngày bắt đầu
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={startDateDisplay}
                            onChange={(e) => handleDateInput(e.target.value, setStartDateDisplay, setStartDate)}
                            placeholder="dd/mm/yyyy"
                            className="flex-1 p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm sm:text-lg"
                            maxLength="10"
                          />
                          <button
                            onClick={() => setToday(setStartDateDisplay, setStartDate)}
                            className="px-2 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                          >
                            Hôm nay
                          </button>
                        </div>
                        {startDateDisplay && !startDate && (
                          <p className="text-red-500 text-xs mt-1">Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)</p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                            Thêm ngày
                          </label>
                          <input
                            type="number"
                            value={addDays}
                            onChange={(e) => setAddDays(e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                            Thêm tháng
                          </label>
                          <input
                            type="number"
                            value={addMonths}
                            onChange={(e) => setAddMonths(e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                            Thêm năm
                          </label>
                          <input
                            type="number"
                            value={addYears}
                            onChange={(e) => setAddYears(e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                          />
                        </div>
                      </div>

                      {/* Exclude options */}
                      <div className="space-y-2 bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="excludeWeekendsAdd"
                            checked={excludeWeekendsAdd}
                            onChange={(e) => setExcludeWeekendsAdd(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="excludeWeekendsAdd" className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">
                            Không tính thứ 7, chủ nhật
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="excludeHolidaysAdd"
                            checked={excludeHolidaysAdd}
                            onChange={(e) => setExcludeHolidaysAdd(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="excludeHolidaysAdd" className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">
                            Không tính ngày lễ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                      Mốc thời gian thông dụng:
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {presetPeriods.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => applyPreset(preset)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-4 sm:space-y-6">
                  {startDate && resultDate && (
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 sm:p-6 rounded-xl text-white shadow-lg">
                      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                        Kết quả tính toán
                      </h2>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm font-medium mb-1">Ngày bắt đầu:</div>
                          <div className="text-sm sm:text-lg font-bold break-words">{formatDate(startDate)}</div>
                          <div className="text-xs sm:text-sm text-blue-100">{formatShortDate(startDate)}</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm font-medium mb-1">Thời gian cộng thêm:</div>
                          <div className="text-sm sm:text-lg font-bold break-words">
                            {[
                              addYears && `${addYears} năm`,
                              addMonths && `${addMonths} tháng`, 
                              addDays && `${addDays} ngày`
                            ].filter(Boolean).join(', ') || 'Không có'}
                          </div>
                          {(excludeWeekendsAdd || excludeHolidaysAdd) && (
                            <div className="text-xs sm:text-sm text-blue-100 mt-1">
                              Loại trừ: {[
                                excludeWeekendsAdd && 'T7, CN',
                                excludeHolidaysAdd && 'Ngày lễ'
                              ].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>

                        <div className="bg-white/30 backdrop-blur rounded-lg p-4 sm:p-5 border-2 border-white/50">
                          <div className="text-xs sm:text-sm font-medium mb-1">Ngày kết quả:</div>
                          <div className="text-lg sm:text-2xl font-bold break-words">{formatDate(resultDate)}</div>
                          <div className="text-sm sm:text-lg text-blue-100 mt-1">{formatShortDate(resultDate)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      Ví dụ sử dụng:
                    </h3>
                    <div className="text-xs sm:text-sm text-blue-800 space-y-1 sm:space-y-2">
                      <div>• Tính thời hạn hiệu lực hộ chiếu (10 năm từ ngày cấp)</div>
                      <div>• Tính hạn nộp thuế (30 ngày từ ngày ký hợp đồng)</div>
                      <div>• Tính thời hạn khiếu nại (60 ngày từ ngày có quyết định)</div>
                      <div>• Tính thời hạn xử lý hồ sơ (15 ngày làm việc)</div>
                      <div>• Tính ngày hết hạn visa (90 ngày từ ngày nhập cảnh)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date Difference Tab */}
            {activeTab === 'date-diff' && (
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Input Form */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-200">
                    <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6 flex items-center gap-2">
                      <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
                      Tính khoảng cách giữa hai mốc thời gian
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Từ ngày
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={fromDateDisplay}
                            onChange={(e) => handleDateInput(e.target.value, setFromDateDisplay, setFromDate)}
                            placeholder="dd/mm/yyyy"
                            className="flex-1 p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm sm:text-lg"
                            maxLength="10"
                          />
                          <button
                            onClick={() => setToday(setFromDateDisplay, setFromDate)}
                            className="px-2 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                          >
                            Hôm nay
                          </button>
                        </div>
                        {fromDateDisplay && !fromDate && (
                          <p className="text-red-500 text-xs mt-1">Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Đến ngày
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={toDateDisplay}
                            onChange={(e) => handleDateInput(e.target.value, setToDateDisplay, setToDate)}
                            placeholder="dd/mm/yyyy"
                            className="flex-1 p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm sm:text-lg"
                            maxLength="10"
                          />
                          <button
                            onClick={() => setToday(setToDateDisplay, setToDate)}
                            className="px-2 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                          >
                            Hôm nay
                          </button>
                        </div>
                        {toDateDisplay && !toDate && (
                          <p className="text-red-500 text-xs mt-1">Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)</p>
                        )}
                      </div>

                      {/* Exclude options */}
                      <div className="space-y-2 bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="excludeWeekendsDiff"
                            checked={excludeWeekendsDiff}
                            onChange={(e) => setExcludeWeekendsDiff(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="excludeWeekendsDiff" className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">
                            Không tính thứ 7, chủ nhật
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="excludeHolidaysDiff"
                            checked={excludeHolidaysDiff}
                            onChange={(e) => setExcludeHolidaysDiff(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="excludeHolidaysDiff" className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">
                            Không tính ngày lễ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-4 sm:space-y-6">
                  {fromDate && toDate && (
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 sm:p-6 rounded-xl text-white shadow-lg">
                      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                        Kết quả tính toán
                      </h2>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm font-medium mb-1">Từ ngày:</div>
                          <div className="text-sm sm:text-lg font-bold break-words">{formatDate(fromDate)}</div>
                          <div className="text-xs sm:text-sm text-blue-100">{formatShortDate(fromDate)}</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm font-medium mb-1">Đến ngày:</div>
                          <div className="text-sm sm:text-lg font-bold break-words">{formatDate(toDate)}</div>
                          <div className="text-xs sm:text-sm text-blue-100">{formatShortDate(toDate)}</div>
                        </div>

                        <div className="bg-white/30 backdrop-blur rounded-lg p-4 sm:p-5 border-2 border-white/50">
                          <div className="text-xs sm:text-sm font-medium mb-2">Khoảng cách thời gian:</div>
                          <div className="space-y-2">
                            <div className="text-lg sm:text-2xl font-bold">
                              {daysDifference} {(excludeWeekendsDiff || excludeHolidaysDiff) ? 'ngày làm việc' : 'ngày'}
                            </div>
                            {(yearsDifference > 0 || monthsDifference > 0) && (
                              <div className="text-sm sm:text-lg text-blue-100">
                                {yearsDifference > 0 && `${yearsDifference} năm `}
                                {monthsDifference > 0 && `${monthsDifference} tháng`}
                              </div>
                            )}
                            {(excludeWeekendsDiff || excludeHolidaysDiff) && (
                              <div className="text-xs sm:text-sm text-blue-100 mt-1">
                                Loại trừ: {[
                                  excludeWeekendsDiff && 'T7, CN',
                                  excludeHolidaysDiff && 'Ngày lễ'
                                ].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-5">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      Ví dụ sử dụng:
                    </h3>
                    <div className="text-xs sm:text-sm text-purple-800 space-y-1 sm:space-y-2">
                      <div>• Tính tuổi từ ngày sinh đến hiện tại</div>
                      <div>• Tính thời gian làm việc tại công ty</div>
                      <div>• Tính thời gian còn lại đến hạn nộp hồ sơ</div>
                      <div>• Tính khoảng cách giữa hai sự kiện (chỉ ngày làm việc)</div>
                      <div>• Tính thời gian trễ hạn nộp thuế</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Working Days Tab */}
            {activeTab === 'working-days' && (
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Input Form */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-200">
                    <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                      Thống kê ngày làm việc chi tiết
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Từ ngày
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={workFromDateDisplay}
                            onChange={(e) => handleDateInput(e.target.value, setWorkFromDateDisplay, setWorkFromDate)}
                            placeholder="dd/mm/yyyy"
                            className="flex-1 p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm sm:text-lg"
                            maxLength="10"
                          />
                          <button
                            onClick={() => setToday(setWorkFromDateDisplay, setWorkFromDate)}
                            className="px-2 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                          >
                            Hôm nay
                          </button>
                        </div>
                        {workFromDateDisplay && !workFromDate && (
                          <p className="text-red-500 text-xs mt-1">Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Đến ngày
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={workToDateDisplay}
                            onChange={(e) => handleDateInput(e.target.value, setWorkToDateDisplay, setWorkToDate)}
                            placeholder="dd/mm/yyyy"
                            className="flex-1 p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm sm:text-lg"
                            maxLength="10"
                          />
                          <button
                            onClick={() => setToday(setWorkToDateDisplay, setWorkToDate)}
                            className="px-2 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                          >
                            Hôm nay
                          </button>
                        </div>
                        {workToDateDisplay && !workToDate && (
                          <p className="text-red-500 text-xs mt-1">Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Holiday Info */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 sm:p-5">
                    <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      Ngày lễ được tính:
                    </h3>
                    <div className="text-xs sm:text-sm text-amber-800 space-y-1">
                      <div>• Tết Dương lịch (01/01)</div>
                      <div>• Tết Nguyên đán (7 ngày theo âm lịch)</div>
                      <div>• Giỗ tổ Hùng Vương (10/03 âm lịch)</div>
                      <div>• Ngày Giải phóng miền Nam (30/04)</div>
                      <div>• Ngày Quốc tế Lao động (01/05)</div>
                      <div>• Ngày Quốc khánh (02/09)</div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-4 sm:space-y-6">
                  {workFromDate && workToDate && (
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 sm:p-6 rounded-xl text-white shadow-lg">
                      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                        Kết quả thống kê
                      </h2>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm font-medium mb-1">Từ ngày:</div>
                          <div className="text-sm sm:text-lg font-bold break-words">{formatDate(workFromDate)}</div>
                          <div className="text-xs sm:text-sm text-blue-100">{formatShortDate(workFromDate)}</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4">
                          <div className="text-xs sm:text-sm font-medium mb-1">Đến ngày:</div>
                          <div className="text-sm sm:text-lg font-bold break-words">{formatDate(workToDate)}</div>
                          <div className="text-xs sm:text-sm text-blue-100">{formatShortDate(workToDate)}</div>
                        </div>

                        <div className="bg-white/30 backdrop-blur rounded-lg p-4 sm:p-5 border-2 border-white/50">
                          <div className="text-xs sm:text-sm font-medium mb-2">Ngày làm việc:</div>
                          <div className="text-2xl sm:text-3xl font-bold text-center">{workingDays} ngày</div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          <div className="bg-white/20 backdrop-blur rounded-lg p-2 sm:p-3 text-center">
                            <div className="text-xs sm:text-sm font-medium">Tổng số ngày</div>
                            <div className="text-lg sm:text-xl font-bold">{totalDays}</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur rounded-lg p-2 sm:p-3 text-center">
                            <div className="text-xs sm:text-sm font-medium">Cuối tuần</div>
                            <div className="text-lg sm:text-xl font-bold">{weekendDays}</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur rounded-lg p-2 sm:p-3 text-center">
                            <div className="text-xs sm:text-sm font-medium">Ngày lễ</div>
                            <div className="text-lg sm:text-xl font-bold">{holidayDays}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      Ví dụ sử dụng:
                    </h3>
                    <div className="text-xs sm:text-sm text-green-800 space-y-1 sm:space-y-2">
                      <div>• Thống kê ngày làm việc trong tháng/quý</div>
                      <div>• Tính thời gian xử lý hồ sơ hành chính (15 ngày làm việc)</div>
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
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-xl p-4 sm:p-6">
          <div className="text-center">
            <p className="text-white font-bold text-sm sm:text-lg flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              © {new Date().getFullYear()} VPCC Nguyễn Thị Như Trang - Nguyễn Tùng Lâm
            </p>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              Chính xác - Nhanh chóng - Chuyên nghiệp
            </p>
            <p className="text-blue-200 text-xs mt-1">
              Phiên bản 0.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateCalculator;
