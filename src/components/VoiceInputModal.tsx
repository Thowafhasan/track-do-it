'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Check, X, Volume2, ArrowRight } from 'lucide-react';
import { parseIndonesianFinancialText, ParsedTransaction } from '@/lib/nlpParser';
import { formatIDR } from '@/lib/mockData';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (parsed: ParsedTransaction) => void;
}

export function VoiceInputModal({ isOpen, onClose, onConfirm }: VoiceInputModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedTransaction | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Suggested quick prompts for easy testing
  const samplePrompts = [
    'Beli kopi Starbucks 65rb pakai GoPay',
    'Makan siang di Warteg 25 ribu tunai',
    'Isi bensin Pertamax 100rb pake Mandiri',
    'Beli buah di Indomaret 85 ribu bca'
  ];

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript('');
      setParsedResult(null);
      return;
    }

    // Check Speech Recognition support in browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        const parsed = parseIndonesianFinancialText(currentText);
        setParsedResult(parsed);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleManualTextChange = (text: string) => {
    setTranscript(text);
    if (text.trim().length > 0) {
      const parsed = parseIndonesianFinancialText(text);
      setParsedResult(parsed);
    } else {
      setParsedResult(null);
    }
  };

  const handleApplySample = (sample: string) => {
    handleManualTextChange(sample);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">Catat Cepat via Voice AI</h3>
              <p className="text-xs text-zinc-400">Bicara bebas dalam bahasa Indonesia</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microphone Pulse Area */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
                : 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30 hover:scale-105'
            }`}
          >
            {isListening && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            )}
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <p className="text-xs font-medium text-zinc-400">
            {isListening ? 'Mendengarkan... Tekan untuk berhenti' : 'Ketuk mikrofon untuk mulai bicara'}
          </p>

          {!speechSupported && (
            <p className="text-[11px] text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Web Speech API tidak didukung di browser ini. Anda bisa mengetik langsung di bawah.
            </p>
          )}
        </div>

        {/* Transcription Input / Display */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={transcript}
              onChange={(e) => handleManualTextChange(e.target.value)}
              placeholder="Contoh: 'Beli kopi Starbucks 60rb pake GoPay'..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition"
            />
            {transcript && (
              <button
                onClick={() => handleManualTextChange('')}
                className="absolute right-3 top-3 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick sample chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-500 self-center mr-1">Coba ucapan:</span>
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleApplySample(s)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Parsed REA Preview */}
        {parsedResult && parsedResult.amount > 0 && (
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Entitas Terdeteksi Otomatis
              </span>
              <span>Akurasi {Math.round(parsedResult.confidence * 100)}%</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Nominal Transaksi</span>
                <span className="text-base font-bold text-zinc-100">
                  {formatIDR(parsedResult.amount)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Kategori</span>
                <span className="text-sm font-semibold text-zinc-200">
                  {parsedResult.categoryName}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Sumber Akun (Resource)</span>
                <span className="text-sm font-semibold text-zinc-200">
                  {parsedResult.accountName}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Merchant (Agent)</span>
                <span className="text-sm font-semibold text-zinc-200">
                  {parsedResult.merchant || 'Umum'}
                </span>
              </div>
            </div>

              <button
                onClick={() => {
                  onConfirm(parsedResult);
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Transaksi Langsung (&lt; 5 Detik)</span>
              </button>
          </div>
        )}
      </div>
    </div>
  );
}
