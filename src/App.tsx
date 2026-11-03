import { useState, useMemo, useCallback } from 'react';
import { hotels, categories, getHotelsByCategory, Hotel } from './data/hotels';
import { generateVoucherPDF } from './utils/voucherGenerator';

// Hotel brand colors for preview
const hotelBrands: Record<string, { primary: string; secondary: string; accent: string }> = {
  'jw-marriott-marquis': { primary: '#6B2D5B', secondary: '#B8860B', accent: '#1a1a1a' },
  'atlantis-palm': { primary: '#003366', secondary: '#00A5E0', accent: '#FFD700' },
  'creekside-accor': { primary: '#003366', secondary: '#7EB5DA', accent: '#00A859' },
  'doubletree-m-square': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'radisson-deira-creek': { primary: '#003DA5', secondary: '#FFD100', accent: '#CC0000' },
  'westminster-dubai-mall': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
  'millennium-central': { primary: '#8B0000', secondary: '#D4AF37', accent: '#1a1a1a' },
  'marriott-executive-creek': { primary: '#6B2D5B', secondary: '#B8860B', accent: '#1a1a1a' },
  'tower-plaza': { primary: '#1C1C1C', secondary: '#C4A35A', accent: '#8B0000' },
  'movenpick-creek': { primary: '#8B0000', secondary: '#D4AF37', accent: '#2F4F4F' },
  'paramount-dubai': { primary: '#1a1a1a', secondary: '#C4A35A', accent: '#8B0000' },
  'holiday-inn-express-airport': { primary: '#007B5F', secondary: '#FFC72C', accent: '#1a1a1a' },
  'mercure-gold-al-mina': { primary: '#003366', secondary: '#7EB5DA', accent: '#00A859' },
  'holiday-inn-express-safa': { primary: '#007B5F', secondary: '#FFC72C', accent: '#1a1a1a' },
  'golden-sands-3': { primary: '#D4AF37', secondary: '#8B4513', accent: '#1a1a1a' },
  'ibis-styles-deira': { primary: '#E30613', secondary: '#1a1a1a', accent: '#FFC72C' },
  'atana-hotel': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
  'jannah-creek': { primary: '#006847', secondary: '#D4AF37', accent: '#1a1a1a' },
  'courtyard-wtc': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'four-points-sheikh-zayed': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'emirates-palace': { primary: '#D4AF37', secondary: '#8B4513', accent: '#1a1a1a' },
  'dusit-thani-ad': { primary: '#6B2D5B', secondary: '#D4AF37', accent: '#1a1a1a' },
  'rixos-marina': { primary: '#8B0000', secondary: '#D4AF37', accent: '#1a1a1a' },
  'khalidiya-palace': { primary: '#006847', secondary: '#D4AF37', accent: '#1a1a1a' },
  'hilton-yas-island': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'w-abu-dhabi': { primary: '#1a1a1a', secondary: '#555555', accent: '#8B0000' },
  'royal-m-hotel': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
  'intercontinental-abu-dhabi': { primary: '#003366', secondary: '#7EB5DA', accent: '#00A859' },
  'conrad-etihad': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'grand-hyatt-ad': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#D4AF37' },
  'marriott-downtown-ad': { primary: '#6B2D5B', secondary: '#B8860B', accent: '#1a1a1a' },
  'royal-rose': { primary: '#8B0000', secondary: '#D4AF37', accent: '#1a1a1a' },
  'sofitel-corniche': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
  'st-regis-ad': { primary: '#1a1a1a', secondary: '#C4A35A', accent: '#8B0000' },
  'four-seasons-al-maryah': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
};

function getBrandColors(hotelId: string) {
  return hotelBrands[hotelId] || { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' };
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [guestNames, setGuestNames] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [boardBasis, setBoardBasis] = useState<string>('Room Only');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
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
      alert('Please fill in all required fields: Hotel, Guest Names, Check-In Date, and Check-Out Date');
      return;
    }

    setIsGenerating(true);
    
    try {
      const batchSize = 50;
      const totalBatches = Math.ceil(parsedGuests.length / batchSize);
      
      let currentBatch = 0;
      
      const processBatch = () => {
        try {
          const start = currentBatch * batchSize;
          const end = Math.min(start + batchSize, parsedGuests.length);
          const batchGuests = parsedGuests.slice(start, end);
          
          const doc = generateVoucherPDF(selectedHotel, batchGuests, checkInDate, checkOutDate, boardBasis);
          const batchNum = currentBatch + 1;
          const fileName = `${selectedHotel.name.replace(/[^a-zA-Z0-9]/g, '_')}_Voucher_Part${batchNum}.pdf`;
          
          // Use doc.save() for reliable download
          doc.save(fileName);
          
          currentBatch++;
          
          if (currentBatch < totalBatches) {
            setTimeout(processBatch, 200);
          } else {
            setIsGenerating(false);
            setSuccessMessage(`Successfully downloaded ${totalBatches} voucher PDF(s) for ${parsedGuests.length} guests!`);
            setTimeout(() => setSuccessMessage(''), 5000);
          }
        } catch (batchError) {
          console.error('Error in batch:', batchError);
          setIsGenerating(false);
          alert('Error generating PDF. Please check the console for details.');
        }
      };
      
      processBatch();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      alert('Error generating PDF. Please check the console for details.');
    }
  }, [selectedHotel, parsedGuests, checkInDate, checkOutDate, boardBasis]);

  const handlePrint = useCallback(() => {
    if (!selectedHotel || parsedGuests.length === 0 || !checkInDate || !checkOutDate) {
      alert('Please fill in all required fields before printing');
      return;
    }

    try {
      const doc = generateVoucherPDF(selectedHotel, parsedGuests, checkInDate, checkOutDate, boardBasis);
      
      // Open PDF in new window for printing
      const pdfData = doc.output('bloburl');
      const printWindow = window.open(pdfData, '_blank');
      
      if (printWindow) {
        // Wait for the PDF to load then print
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      } else {
        // Fallback: download the PDF
        const fileName = `${selectedHotel.name.replace(/[^a-zA-Z0-9]/g, '_')}_Voucher.pdf`;
        doc.save(fileName);
        alert('Print window was blocked by your browser. PDF has been downloaded instead. Please allow pop-ups for this site to enable printing.');
      }
    } catch (error) {
      console.error('Error printing PDF:', error);
      alert('Error printing PDF. Please try downloading instead.');
    }
  }, [selectedHotel, parsedGuests, checkInDate, checkOutDate, boardBasis]);

  const roomCount = Math.ceil(parsedGuests.length / 2);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">Hotel Voucher Portal</h1>
              <p className="text-[11px] text-slate-500 -mt-0.5">Bulk Voucher Issuing System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              System Active
            </span>
            <span className="text-slate-300">|</span>
            <span>{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-16 right-4 z-50 bg-white border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Panel - Form */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Hotel Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">1</span>
                </div>
                <h2 className="text-sm font-semibold text-slate-700">Select Hotel</h2>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Hotel</label>
                  <select 
                    value={selectedHotelId}
                    onChange={(e) => setSelectedHotelId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all"
                  >
                    <option value="">-- Select a Hotel --</option>
                    {filteredHotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} ({hotel.starRating}★)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedHotel && (
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 text-sm leading-tight">{selectedHotel.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-amber-500 text-xs">{'★'.repeat(selectedHotel.starRating)}</span>
                          <span className="text-[11px] text-slate-500">{selectedHotel.rating} ({selectedHotel.reviews})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{selectedHotel.address}</p>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <span className="text-base font-bold text-slate-800">{selectedHotel.price}</span>
                        <p className="text-[10px] text-slate-400">/night</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dates & Board */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">2</span>
                </div>
                <h2 className="text-sm font-semibold text-slate-700">Stay Details</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Check-In</label>
                    <input 
                      type="date" 
                      value={checkInDate}
                      min={today}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Check-Out</label>
                    <input 
                      type="date" 
                      value={checkOutDate}
                      min={checkInDate || today}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Board Basis</label>
                  <select 
                    value={boardBasis}
                    onChange={(e) => setBoardBasis(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all"
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

            {/* Guest Names */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">3</span>
                  </div>
                  <h2 className="text-sm font-semibold text-slate-700">Guest Names</h2>
                </div>
                {parsedGuests.length > 0 && (
                  <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {parsedGuests.length} guest{parsedGuests.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="p-4 space-y-3">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enter one guest name per line. You can paste multiple names at once. Each room accommodates 2 guests.
                </p>
                <textarea 
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder={"Mr. Anil Kumar\nMr. Rajesh Sharma\nMrs. Priya Patel\nMr. Mohammed Ali\n..."}
                  rows={8}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all resize-none"
                />
                
                {parsedGuests.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-blue-50 rounded-lg p-2.5 text-center border border-blue-100">
                      <p className="text-lg font-bold text-blue-700">{parsedGuests.length}</p>
                      <p className="text-[10px] text-blue-500 font-medium uppercase tracking-wide">Guests</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2.5 text-center border border-emerald-100">
                      <p className="text-lg font-bold text-emerald-700">{roomCount}</p>
                      <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide">Rooms</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2.5 text-center border border-amber-100">
                      <p className="text-lg font-bold text-amber-700">
                        {checkInDate && checkOutDate ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))) : '—'}
                      </p>
                      <p className="text-[10px] text-amber-500 font-medium uppercase tracking-wide">Nights</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Download Button */}
              <button 
                onClick={handleGeneratePDF}
                disabled={!selectedHotel || parsedGuests.length === 0 || !checkInDate || !checkOutDate || isGenerating}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 text-sm"
              >
                {isGenerating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Download PDF Voucher
                  </>
                )}
              </button>

              {/* Print Button */}
              <button 
                onClick={handlePrint}
                disabled={!selectedHotel || parsedGuests.length === 0 || !checkInDate || !checkOutDate || isGenerating}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Print Voucher
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-[72px]">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <h2 className="text-sm font-semibold text-slate-700">Voucher Preview</h2>
                </div>
                {selectedHotel && parsedGuests.length > 0 && (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                    Live
                  </span>
                )}
              </div>
              
              <div className="p-4 max-h-[calc(100vh-140px)] overflow-y-auto">
                {!selectedHotel || parsedGuests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-slate-500 font-medium text-sm mb-1">No Preview Available</h3>
                    <p className="text-xs text-slate-400 max-w-[250px]">Select a hotel and enter guest names to preview the voucher</p>
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
  const colors = getBrandColors(hotel.id);
  const roomCount = Math.ceil(guests.length / 2);
  const nights = checkInDate && checkOutDate 
    ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const roomAssignments: { roomNumber: number; guests: string[]; roomType: string; bedType: string }[] = [];
  let roomNum = 101;
  
  for (let i = 0; i < guests.length; i += 2) {
    const roomGuests = [guests[i]];
    if (guests[i + 1]) roomGuests.push(guests[i + 1]);
    
    const roomType = hotel.roomTypes[Math.floor((i / 2) % hotel.roomTypes.length)];
    const bedTypes = ['Twin Bed', 'Double Bed', 'King Bed', 'Queen Bed'];
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
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const bookingRef = 'BK' + Math.random().toString(36).substr(2, 8).toUpperCase();
  const initials = hotel.name.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('');

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Top accent bars */}
      <div className="h-1" style={{ backgroundColor: colors.primary }}></div>
      <div className="h-0.5" style={{ backgroundColor: colors.secondary }}></div>
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            {/* Hotel Logo Circle */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2"
              style={{ backgroundColor: colors.primary, borderColor: colors.secondary }}
            >
              <div className="text-center">
                <p className="text-white text-[8px] font-bold leading-none">{initials}</p>
                <p className="text-[10px]" style={{ color: colors.secondary }}>★</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight" style={{ color: colors.primary }}>
                {hotel.name.toUpperCase()}
              </h3>
              <div className="text-xs mt-0.5" style={{ color: colors.secondary }}>
                {'★'.repeat(hotel.starRating)}{'☆'.repeat(5 - hotel.starRating)}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{hotel.address}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Booking Ref</p>
            <p className="text-xs font-mono font-bold" style={{ color: colors.primary }}>{bookingRef}</p>
            <p className="text-[9px] text-slate-400 mt-1">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Confirmed Badge */}
        <div className="flex justify-end -mt-14 mr-2 mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-600 bg-emerald-600 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-[6px] font-bold leading-none">CONFIRMED</p>
              <p className="text-emerald-200 text-[5px]">GUARANTEED</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-3 mt-2">
          <h2 className="text-base font-bold" style={{ color: colors.primary }}>HOTEL BOOKING VOUCHER</h2>
          <p className="text-[10px] text-slate-400">This document serves as confirmation of your hotel reservation</p>
          <div className="h-px w-20 mx-auto mt-2" style={{ backgroundColor: colors.primary, opacity: 0.3 }}></div>
        </div>

        {/* Dates Section */}
        <div className="bg-slate-50 rounded-lg p-3 mb-3 flex items-center justify-between border border-slate-100">
          <div className="text-center flex-1">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Check-In</p>
            <p className="text-xs font-bold" style={{ color: colors.primary }}>{formatDate(checkInDate)}</p>
            <p className="text-[9px] text-slate-400">After 15:00</p>
          </div>
          <div className="text-center px-3 border-x border-slate-200">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Duration</p>
            <p className="text-xl font-bold" style={{ color: colors.accent }}>{nights}</p>
            <p className="text-[9px] text-slate-400 -mt-0.5">NIGHTS</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Check-Out</p>
            <p className="text-xs font-bold" style={{ color: colors.primary }}>{formatDate(checkOutDate)}</p>
            <p className="text-[9px] text-slate-400">Before 12:00</p>
          </div>
        </div>

        {/* Board info */}
        <div className="flex justify-between text-[10px] text-slate-500 mb-3 px-1">
          <span><strong>Board:</strong> {boardBasis}</span>
          <span><strong>Guests:</strong> {guests.length}</span>
          <span><strong>Rooms:</strong> {roomCount}</span>
        </div>

        {/* Guest Table */}
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: colors.primary }}>
            Guest & Room Allocation
          </p>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-[10px]">
              <thead>
                <tr style={{ backgroundColor: colors.primary }}>
                  <th className="py-1.5 px-2 text-left text-white font-semibold">#</th>
                  <th className="py-1.5 px-2 text-left text-white font-semibold">Guest Name</th>
                  <th className="py-1.5 px-2 text-center text-white font-semibold">Room</th>
                  <th className="py-1.5 px-2 text-left text-white font-semibold">Type</th>
                  <th className="py-1.5 px-2 text-left text-white font-semibold">Bed</th>
                </tr>
              </thead>
              <tbody>
                {roomAssignments.map((room, rIdx) => (
                  room.guests.map((guest, gIdx) => (
                    <tr key={`${rIdx}-${gIdx}`} className={gIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-1 px-2 text-slate-400">{rIdx * 2 + gIdx + 1}</td>
                      <td className="py-1 px-2 font-semibold text-slate-700">{guest}</td>
                      <td className="py-1 px-2 text-center">
                        {gIdx === 0 ? (
                          <span className="font-bold" style={{ color: colors.primary }}>{room.roomNumber}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-1 px-2 text-slate-500">{room.roomType}</td>
                      <td className="py-1 px-2 text-slate-500">{room.bedType}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold" style={{ color: colors.primary }}>BOOKING SUMMARY</p>
            <p className="text-[9px] text-slate-500 mt-0.5">
              {guests.length} Guests | {roomCount} Rooms | {nights} Night(s) | {boardBasis}
            </p>
          </div>
          <div className="px-2.5 py-1 rounded text-white text-[9px] font-bold bg-emerald-600">
            PAID
          </div>
        </div>

        {/* Non-refundable Banner */}
        <div className="rounded-lg py-1.5 px-3 text-center mb-3" style={{ backgroundColor: colors.accent }}>
          <p className="text-white text-[10px] font-bold">⚠ THIS BOOKING IS NON-REFUNDABLE AND NON-TRANSFERABLE</p>
        </div>

        {/* Policies */}
        <div className="text-[9px] text-slate-500 space-y-0.5 mb-3 px-1">
          <p>• Check-in: 15:00 | Check-out: 12:00</p>
          <p>• Valid passport/ID required for all guests</p>
          <p>• Room type subject to availability at check-in</p>
          <p>• Security deposit may be required by hotel</p>
          <p>• Present this voucher at reception upon arrival</p>
        </div>

        {/* Barcode */}
        <div className="flex justify-center mb-3">
          <div className="flex items-end gap-[1px]">
            {Array.from({ length: 45 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-slate-800"
                style={{ 
                  width: Math.random() > 0.5 ? '1.5px' : '0.8px', 
                  height: `${20 + Math.random() * 8}px`,
                  opacity: Math.random() > 0.2 ? 1 : 0
                }}
              ></div>
            ))}
          </div>
        </div>
        <p className="text-center text-[8px] text-slate-400 font-mono mb-3 tracking-widest">
          {bookingRef}{Array.from({ length: 6 }).map(() => Math.floor(Math.random() * 10)).join('')}
        </p>

        {/* Premier Hospitality Partners */}
        <div className="mb-3">
          <div className="text-center mb-2">
            <h3 className="text-[10px] font-normal tracking-wider text-slate-700">PREMIER HOSPITALITY PARTNERS</h3>
            <p className="text-[8px] tracking-wider text-slate-400">A CURATED COLLECTION OF LUXURY BRANDS</p>
          </div>
          <div className="grid grid-cols-5 gap-px bg-slate-300 border border-slate-300 rounded overflow-hidden">
            {['Jumeirah', 'Address Hotels', 'Armani Hotel', 'Burj Al Arab', 'One&Only',
              'Atlantis The Palm', 'Kempinski', 'Raffles', 'St. Regis', 'Ritz-Carlton',
              'Mandarin Oriental', 'Four Seasons', 'Waldorf Astoria', 'Park Hyatt', 'W Hotels',
              'Anantara', 'Taj Hotels', 'Oberoi', 'Palazzo Versace', 'Bvlgari Hotel',
              'Fairmont', 'Sofitel', 'Shangri-La', 'InterContinental', 'Marriott Luxury',
              'Westin', 'Le Méridien', 'Radisson Collection', 'Dusit Thani', 'Rixos',
              'Marriott Marquis', 'Hilton Luxury', 'Hyatt Regency', 'Rotana Premier', 'Minor Hotels'
            ].map((partner, idx) => (
              <div key={idx} className="bg-white py-2 px-1 flex items-center justify-center min-h-[32px] hover:bg-slate-50 transition-colors">
                <span className="text-[8px] font-medium tracking-wide text-slate-600 text-center uppercase leading-tight">
                  {partner.length > 18 ? partner.substring(0, 17) + '…' : partner}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-lg p-2.5 text-center" style={{ backgroundColor: colors.primary }}>
          <p className="text-white text-[9px] font-semibold">{hotel.name}</p>
          <p className="text-white/70 text-[8px] mt-0.5">{hotel.address.substring(0, 70)}</p>
          <p className="text-white/60 text-[8px]">Tel: {hotel.phone}</p>
        </div>
        <div className="h-0.5 rounded-b-lg" style={{ backgroundColor: colors.secondary }}></div>
      </div>
    </div>
  );
}

export default App;
