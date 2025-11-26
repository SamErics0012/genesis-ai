'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CurrencyConverterProps {
  inrPrice: number;
  usdPrice: number;
}

export function CurrencyConverter({ inrPrice, usdPrice }: CurrencyConverterProps) {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [exchangeRate, setExchangeRate] = useState<number>(83); // Default INR to USD rate

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    // For now, using a static rate
    setExchangeRate(83);
  }, []);

  const getPrice = () => {
    if (currency === 'INR') {
      return `₹${inrPrice}`;
    } else {
      return `$${usdPrice}`;
    }
  };

  const getConvertedPrice = () => {
    if (currency === 'INR') {
      return `≈ $${(inrPrice / exchangeRate).toFixed(2)}`;
    } else {
      return `≈ ₹${(usdPrice * exchangeRate).toFixed(0)}`;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-1 border border-gray-300 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-sm ${
            currency === 'INR' 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'bg-transparent hover:opacity-70'
          }`}
          onClick={() => setCurrency('INR')}
        >
          INR
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            currency === 'USD' 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'bg-transparent hover:opacity-70'
          }`}
          onClick={() => setCurrency('USD')}
        >
          USD
        </button>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{getPrice()}</div>
        <div className="text-sm opacity-70">{getConvertedPrice()}</div>
      </div>
    </div>
  );
}
