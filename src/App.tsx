import { useState, useMemo, useCallback } from 'react';
import { hotels, categories, getHotelsByCategory, Hotel } from './data/hotels';
import { generateVoucherPDF } from './utils/voucherGenerator';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [guestNames, setGuestNames] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [boardBasis, setBoardBasis] = useState<string>('Room Only');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const filteredHotels = useMemo(() => {
    return getHotelsByCategory(selectedCategory);
  }, [selectedCategory]);

  const selectedHotel = useMemo(() => {
    return hotels.find(h => h.id === selectedHotelId) || null;
  }, [selectedHotelId]);

  const parsedGuests = useMemo(() => {
    if (!guestNames.trim()) return [];
    return guestNames
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
  }, [guestNames]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedHotelId('');
  }, []);

  const handleGeneratePDF = useCallback(() => {
    if (!selectedHotel || parsedGuests.length === 0 || !checkInDate || !checkOutDate) {
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate PDF in chunks to prevent UI freezing
      const batchSize = 50;
      const totalBatches = Math.ceil(parsedGuests.length / batchSize);
      
      let currentBatch = 0;
      
      const processBatch = () => {
        const start = currentBatch * batchSize;
        const end = Math.min(start + batchSize, parsedGuests.length);
        const batchGuests = parsedGuests.slice(start, end);
        
        const doc = generateVoucherPDF(selectedHotel, batchGuests, checkInDate, checkOutDate, boardBasis);
        const batchNum = currentBatch + 1;
        const fileName = `${selectedHotel.name.replace(/[^a-zA-Z0-9]/g, '_')}_Voucher_Part${batchNum}_${Date.now()}.pdf`;
        doc.save(fileName);
        
        currentBatch++;
        
        if (currentBatch < totalBatches) {
          setTimeout(processBatch, 100);
        } else {
          setIsGenerating(false);
          setSuccessMessage(`Successfully generated ${totalBatches} voucher PDF(s) for ${parsedGuests.length} guests!`);
          setTimeout(() => setSuccessMessage(''), 5000);
        }
      };
      
      processBatch();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
    }
  }, [selectedHotel, parsedGuests, checkInDate, checkOutDate, boardBasis]);

  const roomCount = Math.ceil(parsedGuests.length / 2);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0f172a] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ZAIN TRAVEL & TOURISM</h1>
              <p className="text-xs text-slate-400">Bulk Hotel Voucher Issuing Portal</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              System Online
            </span>
            <span>|</span>
            <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg animate-fade-in flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Form */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Hotel Selection Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-5 py-3">
                <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12l-6-3-6 3V4z"/>
                  </svg>
                  SELECT HOTEL
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hotel Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Hotel Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hotel Name</label>
                  <select 
                    value={selectedHotelId}
                    onChange={(e) => setSelectedHotelId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  >
                    <option value="">-- Select a Hotel --</option>
                    {filteredHotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} ({hotel.starRating}★) - {hotel.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Hotel Details */}
                {selectedHotel && (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm">{selectedHotel.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-orange-400 text-xs">
                            {'★'.repeat(selectedHotel.starRating)}
                          </span>
                          <span className="text-xs text-slate-500">{selectedHotel.rating} ({selectedHotel.reviews} reviews)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">{selectedHotel.address}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-red-600">{selectedHotel.price}</span>
                        <p className="text-xs text-slate-400">per night</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      {selectedHotel.phone}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dates & Board */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-5 py-3">
                <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  DATES & DETAILS
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Check-In Date</label>
                    <input 
                      type="date" 
                      value={checkInDate}
                      min={today}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Check-Out Date</label>
                    <input 
                      type="date" 
                      value={checkOutDate}
                      min={checkInDate || today}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Board Basis</label>
                  <select 
                    value={boardBasis}
                    onChange={(e) => setBoardBasis(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  >
                    <option value="Room Only">Room Only (RO)</option>
                    <option value="Bed & Breakfast">Bed & Breakfast (BB)</option>
                    <option value="Half Board">Half Board (HB)</option>
                    <option value="Full Board">Full Board (FB)</option>
                    <option value="All Inclusive">All Inclusive (AI)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guest Names Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-5 py-3">
                <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  GUEST NAMES
                </h2>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-500">
                  Enter one guest name per line. You can paste multiple names at once. Each room will accommodate 2 guests.
                </p>
                <textarea 
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder={"Mr. Anil Kumar\nMr. Rajesh Sharma\nMrs. Priya Patel\nMr. Mohammed Ali\n..."}
                  rows={10}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                />
                
                {/* Stats */}
                {parsedGuests.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                      <p className="text-2xl font-bold text-blue-700">{parsedGuests.length}</p>
                      <p className="text-xs text-blue-500 font-medium">Guests</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                      <p className="text-2xl font-bold text-green-700">{roomCount}</p>
                      <p className="text-xs text-green-500 font-medium">Rooms</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100">
                      <p className="text-2xl font-bold text-orange-700">
                        {checkInDate && checkOutDate ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))) : '-'}
                      </p>
                      <p className="text-xs text-orange-500 font-medium">Nights</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => setShowPreview(true)}
                disabled={!selectedHotel || parsedGuests.length === 0 || !checkInDate || !checkOutDate}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Preview Voucher
              </button>
              
              <button 
                onClick={handleGeneratePDF}
                disabled={!selectedHotel || parsedGuests.length === 0 || !checkInDate || !checkOutDate || isGenerating}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Generate & Download PDF Voucher
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-5 py-3 flex items-center justify-between">
                <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                  </svg>
                  VOUCHER PREVIEW
                </h2>
                {showPreview && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Live Preview
                  </span>
                )}
              </div>
              
              <div className="p-5">
                {!selectedHotel || parsedGuests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-slate-500 font-medium mb-1">No Preview Available</h3>
                    <p className="text-xs text-slate-400 max-w-xs">Select a hotel and enter guest names to see a live preview of the voucher</p>
                  </div>
                ) : (
                  <VoucherPreview 
                    hotel={selectedHotel}
                    guests={parsedGuests}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    boardBasis={boardBasis}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold">Zain Travel & Tourism LLC</p>
                <p className="text-xs text-slate-400">Licensed by DTCM Dubai</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 text-center">
              <p>24/7 Support: +971 4 XXX XXXX | support@zaintravel.com</p>
              <p className="mt-1">© 2024 Zain Travel & Tourism. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Voucher Preview Component
function VoucherPreview({ hotel, guests, checkInDate, checkOutDate, boardBasis }: {
  hotel: Hotel;
  guests: string[];
  checkInDate: string;
  checkOutDate: string;
  boardBasis: string;
}) {
  const roomCount = Math.ceil(guests.length / 2);
  const nights = checkInDate && checkOutDate 
    ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Assign guests to rooms
  const roomAssignments: { roomNumber: number; guests: string[]; roomType: string; bedType: string }[] = [];
  let roomNum = 101;
  
  for (let i = 0; i < guests.length; i += 2) {
    const roomGuests = [guests[i]];
    if (guests[i + 1]) roomGuests.push(guests[i + 1]);
    
    const roomType = hotel.roomTypes[Math.floor((i / 2) % hotel.roomTypes.length)];
    const bedTypes = ['Twin Bed', 'Double Bed', 'King Bed'];
    const bedType = bedTypes[Math.floor((i / 2) % bedTypes.length)];
    
    roomAssignments.push({
      roomNumber: roomNum,
      guests: roomGuests,
      roomType,
      bedType
    });
    roomNum++;
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-inner">
      {/* Voucher Header */}
      <div className="bg-[#0f172a] h-2"></div>
      
      <div className="p-6">
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-red-600 font-bold text-sm">ZAIN</p>
              <p className="text-[9px] text-slate-500 -mt-0.5">TRAVEL & TOURISM</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] tracking-wide">BOOKING VOUCHER</h2>
          <div className="h-0.5 w-16 bg-red-500 mx-auto mt-2"></div>
        </div>

        {/* Booking ID */}
        <div className="flex justify-between items-start text-xs text-slate-500 mb-4">
          <div>
            <span className="font-semibold text-slate-700">Booking ID:</span> ZT-{Math.random().toString(36).substr(2, 8).toUpperCase()}
          </div>
          <div className="text-right">
            <span className="font-semibold text-slate-700">Issued:</span> {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        {/* Hotel Name */}
        <div className="text-center mb-3 relative">
          <h3 className="text-base font-bold text-[#0f172a]">{hotel.name}</h3>
          <div className="text-orange-400 text-sm">{'★'.repeat(hotel.starRating)}</div>
          <p className="text-xs text-slate-500 mt-1">{hotel.address}</p>
          {/* Confirmed Stamp */}
          <div className="absolute right-0 top-0 w-14 h-14 border-2 border-green-600 rounded-full flex items-center justify-center bg-green-50">
            <div className="text-center">
              <p className="text-[7px] font-bold text-green-700">CONFIRMED</p>
              <p className="text-[6px] text-green-600">VERIFIED</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-slate-50 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-slate-500 uppercase">Check-In</p>
            <p className="text-sm font-bold text-[#0f172a]">{formatDate(checkInDate)}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase">Nights</p>
            <p className="text-xl font-bold text-red-600">{nights}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold text-slate-500 uppercase">Check-Out</p>
            <p className="text-sm font-bold text-[#0f172a]">{formatDate(checkOutDate)}</p>
          </div>
        </div>

        {/* Board & Guests Info */}
        <div className="flex justify-between text-xs text-slate-600 mb-4 px-1">
          <span><strong>Board:</strong> {boardBasis}</span>
          <span><strong>Guests:</strong> {guests.length}</span>
          <span><strong>Rooms:</strong> {roomCount}</span>
        </div>

        {/* Guest Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#0f172a] text-white">
                <th className="py-2 px-2 text-left font-semibold">#</th>
                <th className="py-2 px-2 text-left font-semibold">Guest Name</th>
                <th className="py-2 px-2 text-center font-semibold">Room</th>
                <th className="py-2 px-2 text-left font-semibold">Type</th>
                <th className="py-2 px-2 text-left font-semibold">Bed</th>
              </tr>
            </thead>
            <tbody>
              {roomAssignments.map((room, rIdx) => (
                room.guests.map((guest, gIdx) => (
                  <tr key={`${rIdx}-${gIdx}`} className={gIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="py-1.5 px-2 text-slate-500">{rIdx * 2 + gIdx + 1}</td>
                    <td className="py-1.5 px-2 font-semibold text-slate-700">{guest}</td>
                    <td className="py-1.5 px-2 text-center">
                      {gIdx === 0 ? (
                        <span className="font-bold text-red-600">{room.roomNumber}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-1.5 px-2 text-slate-600">{room.roomType}</td>
                    <td className="py-1.5 px-2 text-slate-600">{room.bedType}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-green-800">PAYMENT STATUS: PAID</span>
            <span className="text-xs text-green-600">
              {guests.length} Guests | {roomCount} Rooms | {nights} Night(s)
            </span>
          </div>
        </div>

        {/* Non-refundable Banner */}
        <div className="bg-red-600 text-white text-center py-2 rounded-lg mb-4">
          <p className="text-xs font-bold">⚠ THIS BOOKING IS NON-REFUNDABLE</p>
        </div>

        {/* Policies */}
        <div className="text-[10px] text-slate-500 space-y-0.5 mb-4">
          <p>• Check-in: 15:00 | Check-out: 12:00</p>
          <p>• Valid passport/ID required at check-in</p>
          <p>• Room allocation subject to availability</p>
          <p>• No modifications or cancellations permitted</p>
        </div>

        {/* Barcode simulation */}
        <div className="flex justify-center mb-3">
          <div className="flex items-end gap-[1px]">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-black"
                style={{ 
                  width: Math.random() > 0.5 ? '2px' : '1px', 
                  height: '25px',
                  opacity: Math.random() > 0.3 ? 1 : 0
                }}
              ></div>
            ))}
          </div>
        </div>
        <p className="text-center text-[8px] text-slate-400 font-mono mb-3">
          {Array.from({ length: 20 }).map(() => Math.floor(Math.random() * 10)).join('')}
        </p>

        {/* Support Footer */}
        <div className="bg-[#0f172a] rounded-lg p-3 text-center">
          <p className="text-white text-[10px] font-bold">24/7 SUPPORT</p>
          <p className="text-slate-400 text-[9px] mt-0.5">+971 4 XXX XXXX | support@zaintravel.com</p>
          <p className="text-slate-500 text-[8px] mt-0.5">Zain Travel & Tourism LLC | Licensed by DTCM</p>
        </div>
        <div className="h-1 bg-red-500 rounded-b-lg mt-2"></div>
      </div>
    </div>
  );
}

export default App;
