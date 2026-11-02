'use client';

import React, { useState } from 'react';
import { Camera, Upload, Check, X, FileText, Sparkles, Loader2 } from 'lucide-react';
import { formatIDR } from '@/lib/mockData';

interface ReceiptScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReceipt: (data: {
    amount: number;
    merchantName: string;
    note: string;
    categoryName: string;
    rawText: string;
  }) => void;
}

export function ReceiptScanModal({ isOpen, onClose, onConfirmReceipt }: ReceiptScanModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<{
    amount: number;
    merchantName: string;
    note: string;
    categoryName: string;
    rawText: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setIsScanning(true);
    setExtractedData(null);

    // Simulate OCR Scan with laser animation
    setTimeout(() => {
      setIsScanning(false);
      // Realistic simulated OCR extracted payload
      setExtractedData({
        amount: 178500,
        merchantName: 'Superindo Tebet',
        note: 'Struk belanja sayur, susu & buah segar',
        categoryName: 'Belanja Harian',
        rawText: `SUPERINDO TEBET RAYA\n1x FRESH MILK 1L    Rp 32.500\n1x APEL FUJI 1KG    Rp 48.000\n1x MINYAK GORENG 2L Rp 38.000\n2x TELUR AYAM 10s   Rp 60.000\nTOTAL BELANJA:      Rp 178.500\nBAYAR: QRIS BCA\nTerima kasih atas kunjungan Anda.`
      });
    }, 2000);
  };

  const handleDemoPreset = () => {
    setIsScanning(true);
    setPreviewImage('https://images.unsplash.com/photo-1554415707-9e49fe74a639?q=80&w=400&auto=format&fit=crop');
    setTimeout(() => {
      setIsScanning(false);
      setExtractedData({
        amount: 86000,
        merchantName: 'Kopi Kenangan Senayan',
        note: 'Struk: 2x Kopi Kenangan Mantan + 1x Toast',
        categoryName: 'Food & Beverage',
        rawText: `KOPI KENANGAN SENAYAN CITY\n2x Kopi Kenangan Mantan  Rp 48.000\n1x Cokelat Klasik Toast   Rp 38.000\nTOTAL: Rp 86.000\nPayment: GoPay\nStatus: LUNAS`
      });
    }, 1500);
  };

  const handleReset = () => {
    setPreviewImage(null);
    setExtractedData(null);
    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl relative overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">OCR Receipt Scanner</h3>
              <p className="text-xs text-zinc-400">Scan setruk belanja dan ekstraksi otomatis</p>
            </div>
          </div>

          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload / Camera Box */}
        {!previewImage ? (
          <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-950/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-400">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-200">
                Pilih foto setruk atau ambil gambar
              </p>
              <p className="text-xs text-zinc-500">Mendukung format JPG, PNG, atau scan kamera</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 w-full sm:w-auto">
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md">
                <Camera className="w-4 h-4" />
                <span>Upload / Ambil Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleDemoPreset}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
              >
                Coba Contoh Struk
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview & Scanning Effect */}
            <div className="relative rounded-2xl overflow-hidden bg-black max-h-56 flex items-center justify-center border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Receipt Preview"
                className="w-full h-56 object-cover opacity-80"
              />

              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs">
                  <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse" />
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-zinc-900/90 px-3 py-1.5 rounded-full border border-cyan-500/30">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengekstrak Teks & Nominal OCR...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Extracted Data Result */}
            {extractedData && (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-cyan-500/30 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Hasil Ekstraksi Struk
                  </span>
                  <span>Confidence: 94%</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px] uppercase">Total Tagihan</span>
                    <span className="text-base font-bold text-zinc-100">
                      {formatIDR(extractedData.amount)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px] uppercase">Merchant (Toko)</span>
                    <span className="text-sm font-semibold text-zinc-200">
                      {extractedData.merchantName}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                  <span className="text-zinc-500 block text-[10px] uppercase mb-1">Raw OCR Snippet</span>
                  <pre className="text-[11px] text-zinc-400 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
                    {extractedData.rawText}
                  </pre>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition"
                  >
                    Scan Ulang
                  </button>

                  <button
                    onClick={() => {
                      onConfirmReceipt(extractedData);
                      handleReset();
                      onClose();
                    }}
                    className="flex-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan ke Transaksi</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
