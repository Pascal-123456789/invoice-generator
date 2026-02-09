'use client';

import { generatePDF } from './utils/generatePDF';
import { useState, useEffect } from 'react';

export default function Home() {
  const [invoiceData, setInvoiceData] = useState({
    // Your business info
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    
    // Client info
    toName: '',
    toEmail: '',
    toAddress: '',
    
    // Invoice details
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    
    // Line items
    items: [
      { description: '', quantity: 1, rate: 0 }
    ],
    
    tax: 0,
    notes: ''
  });

  const [isPremium, setIsPremium] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = () => {
    if (typeof window !== 'undefined') {
      const savedCode = localStorage.getItem('invoiceGenPremium');
      if (savedCode) {
        setIsPremium(true);
      }
    }
  };

  const handleUnlock = () => {
    // Simple unlock codes (we'll replace with Stripe later)
    const validCodes = ['PREMIUM2026', 'PAID001', 'UNLOCK123'];
    if (validCodes.includes(unlockCode.toUpperCase())) {
      localStorage.setItem('invoiceGenPremium', unlockCode.toUpperCase());
      setIsPremium(true);
      alert('Success! Watermark removed.');
      setUnlockCode('');
    } else {
      alert('Invalid code. Please try again.');
    }
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = subtotal * (invoiceData.tax / 100);
    return subtotal + taxAmount;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          Invoice Generator
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Create beautiful invoices in seconds
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Invoice Details</h2>
            
            {/* From Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">From (Your Business)</h3>
              <input
                type="text"
                placeholder="Business Name"
                className="w-full p-2 border rounded mb-2 text-gray-900"
                value={invoiceData.fromName}
                onChange={(e) => setInvoiceData({...invoiceData, fromName: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded mb-2 text-gray-900"
                value={invoiceData.fromEmail}
                onChange={(e) => setInvoiceData({...invoiceData, fromEmail: e.target.value})}
              />
              <textarea
                placeholder="Address"
                className="w-full p-2 border rounded text-gray-900"
                rows={2}
                value={invoiceData.fromAddress}
                onChange={(e) => setInvoiceData({...invoiceData, fromAddress: e.target.value})}
              />
            </div>

            {/* To Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">To (Client)</h3>
              <input
                type="text"
                placeholder="Client Name"
                className="w-full p-2 border rounded mb-2 text-gray-900"
                value={invoiceData.toName}
                onChange={(e) => setInvoiceData({...invoiceData, toName: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded mb-2 text-gray-900"
                value={invoiceData.toEmail}
                onChange={(e) => setInvoiceData({...invoiceData, toEmail: e.target.value})}
              />
              <textarea
                placeholder="Address"
                className="w-full p-2 border rounded text-gray-900"
                rows={2}
                value={invoiceData.toAddress}
                onChange={(e) => setInvoiceData({...invoiceData, toAddress: e.target.value})}
              />
            </div>

            {/* Invoice Info */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">Invoice #</label>
                <input
                  type="text"
                  placeholder="001"
                  className="w-full p-2 border rounded text-gray-900"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded text-gray-900"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => setInvoiceData({...invoiceData, invoiceDate: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-900">Due Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded text-gray-900"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Items</h3>
              {invoiceData.items.map((item, index) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full p-2 border rounded mb-2 text-gray-900"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-full p-2 border rounded text-gray-900"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      className="w-full p-2 border rounded text-gray-900"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                    />
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900">${(item.quantity * item.rate).toFixed(2)}</span>
                      {invoiceData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addItem}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 text-gray-600 hover:text-blue-500"
              >
                + Add Item
              </button>
            </div>

            {/* Tax */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-900">Tax (%)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full p-2 border rounded text-gray-900"
                value={invoiceData.tax}
                onChange={(e) => setInvoiceData({...invoiceData, tax: parseFloat(e.target.value) || 0})}
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-900">Notes</label>
              <textarea
                placeholder="Payment terms, thank you note, etc."
                className="w-full p-2 border rounded text-gray-900"
                rows={3}
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Preview</h2>
            
            <div className="border rounded p-6 bg-white">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600">#{invoiceData.invoiceNumber || '001'}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">From</p>
                  <p className="font-semibold text-gray-900">{invoiceData.fromName || 'Your Business'}</p>
                  <p className="text-sm text-gray-700">{invoiceData.fromEmail}</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.fromAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">To</p>
                  <p className="font-semibold text-gray-900">{invoiceData.toName || 'Client Name'}</p>
                  <p className="text-sm text-gray-700">{invoiceData.toEmail}</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.toAddress}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-500">Invoice Date</p>
                  <p className="font-medium text-gray-900">{invoiceData.invoiceDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">{invoiceData.dueDate}</p>
                </div>
              </div>

              <table className="w-full mb-6">
                <thead className="border-b-2">
                  <tr className="text-left text-sm">
                    <th className="pb-2 text-gray-900">Description</th>
                    <th className="pb-2 text-right text-gray-900">Qty</th>
                    <th className="pb-2 text-right text-gray-900">Rate</th>
                    <th className="pb-2 text-right text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-b text-sm">
                      <td className="py-2 text-gray-800">{item.description || 'Service'}</td>
                      <td className="py-2 text-right text-gray-800">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-800">${item.rate.toFixed(2)}</td>
                      <td className="py-2 text-right font-medium text-gray-900">${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-6">
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax ({invoiceData.tax}%)</span>
                    <span className="font-medium text-gray-900">${(calculateSubtotal() * (invoiceData.tax / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {invoiceData.notes && (
                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700 whitespace-pre-line">{invoiceData.notes}</p>
                </div>
              )}

              {!isPremium && (
                <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
                  Created with InvoiceGen
                </div>
              )}
            </div>

            <button
                onClick={() => generatePDF(invoiceData, isPremium)}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
                Download PDF
            </button>

            {!isPremium && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 mb-3">
                  Remove watermark for just <span className="font-bold text-blue-600">$5</span>
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter unlock code"
                    className="flex-1 p-2 border rounded text-gray-900 text-sm"
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value)}
                  />
                  <button
                    onClick={handleUnlock}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Unlock
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Or <a href="#" className="text-blue-600 hover:underline">pay with Stripe →</a>
                </p>
              </div>
            )}

            {isPremium && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">✓ Premium unlocked - No watermark!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
