import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Clock, Plus, Minus, Calculator, ChevronRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

// Constants
const TABS = {
  ADD_TIME: 'add-time',
  DATE_DIFF: 'date-diff',
  WORKING_DAYS: 'working-days'
};

const PRESET_PERIODS = [
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

// Holiday data
const TET_DATES = {
  2024: ['2024-02-08', '2024-02-09', '2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13', '2024-02-14'],
  2025: ['2025-01-27', '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31', '2025-02-01', '2025-02-02'],
  2026: ['2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22'],
  2027: ['2027-02-05', '2027-02-06', '2027-02-07', '2027-02-08', '2027-02-09', '2027-02-10', '2027-02-11'],
  2028: ['2028-01-25', '2028-01-26', '2028-01-27', '2028-01-28', '2028-01-29', '2028-01-30', '2028-01-31'],
};

const HUNG_KING_DATES = {
  2024: '2024-04-18',
  2025: '2025-04-07',
  2026: '2026-04-26',
  2027: '2027-04-16',
  2028: '2028-04-04',
};

// Custom hook for date input
const useDateInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [displayValue, setDisplayValue] = useState('');

  const handleInput = useCallback((e) => {
    const input = e.target.value;
    const cleanValue = input.replace(/\D/g, '');
    
    if (cleanValue.length <= 8) {
      let formatted = cleanValue;
      
      // Auto-format while typing
      if (cleanValue.length >= 2) {
        formatted = cleanValue.slice(0, 2) + (cleanValue.length > 2 ? '/' : '');
        if (cleanValue.length >= 4) {
          formatted += cleanValue.slice(2, 4) + (cleanValue.length > 4 ? '/' : '');
          if (cleanValue.length > 4) {
            formatted += cleanValue.slice(4, 8);
          }
        } else if (cleanValue.length > 2) {
          formatted += cleanValue.slice(2);
        }
      }
      
      setDisplayValue(formatted);
      
      // Convert to ISO format when complete
      if (cleanValue.length === 8) {
        const day = cleanValue.slice(0, 2);
        const month = cleanValue.slice(2, 4);
        const year = cleanValue.slice(4, 8);
        const isoDate = `${year}-${month}-${day}`;
        
        // Validate date
        const date = new Date(isoDate);
        if (date.getFullYear() == year && date.getMonth() + 1 == month && date.getDate() == day) {
          setValue(isoDate);
          setDisplayValue(formatted);
        }
      } else {
        setValue('');
      }
    }
  }, []);

  const setToday = useCallback(() => {
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    setValue(isoDate);
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setDisplayValue(`${day}/${month}/${year}`);
  }, []);

  const reset = useCallback(() => {
    setValue('');
    setDisplayValue('');
  }, []);

  // Sync display value when value changes externally
  useEffect(() => {
    if (value && value.includes('-')) {
      const [year, month, day] = value.split('-');
      setDisplayValue(`${day}/${month}/${year}`);
    }
  }, [value]);

  return { value, displayValue, handleInput, setToday, reset, setValue };
};

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

const getVietnamHolidays = (year) => {
  const holidays = [
    `${year}-01-01`, // Tết Dương lịch
    `${year}-04-30`, // Giải phóng miền Nam
    `${year}-05-01`, // Quốc tế Lao động
    `${year}-09-02`, // Quốc khánh
  ];
  
  // Add Tet holidays
  if (TET_DATES[year]) {
    holidays.push(...TET_DATES[year]);
  }
  
  // Add Hung King date
  if (HUNG_KING_DATES[year]) {
    holidays.push(HUNG_KING_DATES[year]);
  }
  
  return holidays;
};

const isHoliday = (date) => {
  const holidays = getVietnamHolidays(date.getFullYear());
  const dateStr = date.toISOString().split('T')[0];
  return holidays.includes(dateStr);
};

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const isWorkingDay = (date, excludeWeekends = true, excludeHolidays = true) => {
  if (excludeWeekends && isWeekend(date)) return false;
  if (excludeHolidays && isHoliday(date)) return false;
  return true;
};

const addWorkingDays = (startDate, daysToAdd, excludeWeekends, excludeHolidays) => {
  if (!excludeWeekends && !excludeHolidays) {
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

// Components
const DateInput = ({ label, value, displayValue, onChange, onToday, placeholder = "dd/mm/yyyy" }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div className="flex gap-2">
      <input
        type="text"
        value={displayValue}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        maxLength="10"
      />
      <button
        onClick={onToday}
        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
      >
        Hôm nay
      </button>
    </div>
  </div>
);

const NumberInput = ({ label, value, onChange, placeholder = "0" }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min="0"
      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    />
  </div>
);

const CheckboxOption = ({ id, label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
    />
    <label htmlFor={id} className="ml-3 text-sm text-gray-700">
      {label}
    </label>
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 py-4 px-4 font-semibold transition-all text-sm md:text-base ${
      active
        ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-600'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const DateCalculator = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS.ADD_TIME);
  
  // Add Time states
  const startDate = useDateInput();
  const [addDays, setAddDays] = useState('');
  const [addMonths, setAddMonths] = useState('');
  const [addYears, setAddYears] = useState('');
  const [resultDate, setResultDate] = useState('');
  const [excludeWeekendsAdd, setExcludeWeekendsAdd] = useState(false);
  const [excludeHolidaysAdd, setExcludeHolidaysAdd] = useState(false);
  
  // Date Difference states
  const fromDate = useDateInput();
  const toDate = useDateInput();
  const [daysDifference, setDaysDifference] = useState(0);
  const [monthsDifference, setMonthsDifference] = useState(0);
  const [yearsDifference, setYearsDifference] = useState(0);
  const [excludeWeekendsDiff, setExcludeWeekendsDiff] = useState(false);
  const [excludeHolidaysDiff, setExcludeHolidaysDiff] = useState(false);
  
  // Working Days states
  const workFromDate = useDateInput();
  const workToDate = useDateInput();
  const [workingDays, setWorkingDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [weekendDays, setWeekendDays] = useState(0);
  const [holidayDays, setHolidayDays] = useState(0);

  // Memoized calculations
  const calculateAddTime = useCallback(() => {
    if (!startDate.value) return;
    
    const start = new Date(startDate.value);
    let result = new Date(start);
    
    if (addYears) {
      result.setFullYear(result.getFullYear() + parseInt(addYears));
    }
    
    if (addMonths) {
      result.setMonth(result.getMonth() + parseInt(addMonths));
    }
    
    if (addDays) {
      const daysToAdd = parseInt(addDays);
      if (excludeWeekendsAdd || excludeHolidaysAdd) {
        result = addWorkingDays(result, daysToAdd, excludeWeekendsAdd, excludeHolidaysAdd);
      } else {
        result.setDate(result.getDate() + daysToAdd);
      }
    }
    
    setResultDate(result.toISOString().split('T')[0]);
  }, [startDate.value, addDays, addMonths, addYears, excludeWeekendsAdd, excludeHolidaysAdd]);

  const calculateDateDifference = useCallback(() => {
    if (!fromDate.value || !toDate.value) return;
    
    const start = new Date(fromDate.value);
    const end = new Date(toDate.value);
    
    if (end < start) {
      setDaysDifference(0);
      setMonthsDifference(0);
      setYearsDifference(0);
      return;
    }
    
    if (excludeWeekendsDiff || excludeHolidaysDiff) {
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
      const timeDiff = end.getTime() - start.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysDifference(days);
    }
    
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
  }, [fromDate.value, toDate.value, excludeWeekendsDiff, excludeHolidaysDiff]);

  const calculateWorkingDays = useCallback(() => {
    if (!workFromDate.value || !workToDate.value) return;
    
    const start = new Date(workFromDate.value);
    const end = new Date(workToDate.value);
    
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
  }, [workFromDate.value, workToDate.value]);

  // Effects
  useEffect(() => {
    calculateAddTime();
  }, [calculateAddTime]);

  useEffect(() => {
    calculateDateDifference();
  }, [calculateDateDifference]);

  useEffect(() => {
    calculateWorkingDays();
  }, [calculateWorkingDays]);

  // Handlers
  const applyPreset = useCallback((preset) => {
    setAddDays(preset.days.toString());
    setAddMonths(preset.months.toString());
    setAddYears(preset.years.toString());
  }, []);

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
              <Calendar className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">Công Cụ Tính Toán Thời Gian</h1>
            </div>
            
            <div className="w-20 sm:w-24"></div>
          </div>
          <p className="text-center text-blue-100 text-lg">Tính toán thời gian và thời hạn hiệu lực văn bản chính xác</p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-xl rounded-b-2xl">
          <div className="flex flex-col md:flex-row border-b border-gray-200">
            <TabButton
              active={activeTab === TABS.ADD_TIME}
              onClick={() => setActiveTab(TABS.ADD_TIME)}
              icon={Plus}
              label="Cộng Thời Gian"
            />
            <TabButton
              active={activeTab === TABS.DATE_DIFF}
              onClick={() => setActiveTab(TABS.DATE_DIFF)}
              icon={Minus}
              label="Tính Khoảng Cách"
            />
            <TabButton
              active={activeTab === TABS.WORKING_DAYS}
              onClick={() => setActiveTab(TABS.WORKING_DAYS)}
              icon={Clock}
              label="Ngày Làm Việc"
            />
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Add Time Tab */}
            {activeTab === TABS.ADD_TIME && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <Plus className="w-6 h-6" />
                      Cộng thời gian từ ngày cụ thể
                    </h2>
                    
                    <div className="space-y-4">
                      <DateInput
                        label="Ngày bắt đầu"
                        value={startDate.value}
                        displayValue={startDate.displayValue}
                        onChange={startDate.handleInput}
                        onToday={startDate.setToday}
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <NumberInput
                          label="Thêm ngày"
                          value={addDays}
                          onChange={(e) => setAddDays(e.target.value)}
                        />
                        <NumberInput
                          label="Thêm tháng"
                          value={addMonths}
                          onChange={(e) => setAddMonths(e.target.value)}
                        />
                        <NumberInput
                          label="Thêm năm"
                          value={addYears}
                          onChange={(e) => setAddYears(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                        <CheckboxOption
                          id="excludeWeekendsAdd"
                          label="Không tính thứ 7, chủ nhật"
                          checked={excludeWeekendsAdd}
                          onChange={(e) => setExcludeWeekendsAdd(e.target.checked)}
                        />
                        <CheckboxOption
                          id="excludeHolidaysAdd"
                          label="Không tính ngày lễ"
                          checked={excludeHolidaysAdd}
                          onChange={(e) => setExcludeHolidaysAdd(e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Mốc thời gian thông dụng:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {PRESET_PERIODS.map((preset, index) => (
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

                <div className="space-y-6">
                  {startDate.value && resultDate && (
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Kết quả tính toán
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Từ ngày:</div>
                          <div className="text-lg font-bold">{formatDate(fromDate.value)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(fromDate.value)}</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Đến ngày:</div>
                          <div className="text-lg font-bold">{formatDate(toDate.value)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(toDate.value)}</div>
                        </div>

                        <div className="bg-white/30 backdrop-blur rounded-lg p-5 border-2 border-white/50">
                          <div className="text-sm font-medium mb-2">Khoảng cách thời gian:</div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold">
                              {daysDifference} {(excludeWeekendsDiff || excludeHolidaysDiff) ? 'ngày làm việc' : 'ngày'}
                            </div>
                            {(yearsDifference > 0 || monthsDifference > 0) && (
                              <div className="text-lg text-blue-100">
                                {yearsDifference > 0 && `${yearsDifference} năm `}
                                {monthsDifference > 0 && `${monthsDifference} tháng`}
                              </div>
                            )}
                            {(excludeWeekendsDiff || excludeHolidaysDiff) && (
                              <div className="text-sm text-blue-100 mt-1">
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

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      Ví dụ sử dụng:
                    </h3>
                    <div className="text-sm text-purple-800 space-y-2">
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
            {activeTab === TABS.WORKING_DAYS && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <Clock className="w-6 h-6" />
                      Thống kê ngày làm việc chi tiết
                    </h2>
                    
                    <div className="space-y-4">
                      <DateInput
                        label="Từ ngày"
                        value={workFromDate.value}
                        displayValue={workFromDate.displayValue}
                        onChange={workFromDate.handleInput}
                        onToday={workFromDate.setToday}
                      />

                      <DateInput
                        label="Đến ngày"
                        value={workToDate.value}
                        displayValue={workToDate.displayValue}
                        onChange={workToDate.handleInput}
                        onToday={workToDate.setToday}
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5">
                    <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Ngày lễ được tính:
                    </h3>
                    <div className="text-sm text-amber-800 space-y-1">
                      <div>• Tết Dương lịch (01/01)</div>
                      <div>• Tết Nguyên đán (7 ngày theo âm lịch)</div>
                      <div>• Giỗ tổ Hùng Vương (10/03 âm lịch)</div>
                      <div>• Ngày Giải phóng miền Nam (30/04)</div>
                      <div>• Ngày Quốc tế Lao động (01/05)</div>
                      <div>• Ngày Quốc khánh (02/09)</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {workFromDate.value && workToDate.value && (
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Kết quả thống kê
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Từ ngày:</div>
                          <div className="text-lg font-bold">{formatDate(workFromDate.value)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(workFromDate.value)}</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">Đến ngày:</div>
                          <div className="text-lg font-bold">{formatDate(workToDate.value)}</div>
                          <div className="text-sm text-blue-100">{formatShortDate(workToDate.value)}</div>
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

                  {workFromDate.value && workToDate.value && totalDays > 0 && (
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

                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      Ví dụ sử dụng:
                    </h3>
                    <div className="text-sm text-green-800 space-y-2">
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
              Phiên bản 0.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateCalculator;
