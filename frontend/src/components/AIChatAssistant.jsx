import React, { useState } from 'react';
import axios from 'axios';

const AIChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false); 
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setAnswer('');
        try {
            const response = await axios.post('`${import.meta.env.VITE_BACKEND_API_BASE}/ai/query-products`', { query });
            setAnswer(response.data.answer);
        } catch (error) {
            setAnswer("小幫手目前額度用完囉，請稍後再試！");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="w-80 sm:w-96 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5">
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                        <span className="font-bold">AI小幫手</span>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">✕</button>
                    </div>

                    <div className="p-4 h-80 overflow-y-auto bg-gray-50 text-sm">
                        {answer ? (
                            <div className="bg-white p-3 rounded-lg shadow-sm text-gray-700">
                                {answer}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center mt-10">想找什麼嗎？直接問我吧！</p>
                        )}
                        {loading && <p className="text-blue-500 text-center mt-2">正在檢索庫存...</p>}
                    </div>

                    <div className="p-3 bg-white border-t flex gap-2">
                        <input
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            placeholder="輸入商品..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && askAI()}
                        />
                        <button 
                            onClick={askAI}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                            送出
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95 text-white text-2xl"
            >
                {isOpen ? '✕' : '✨'}
            </button>
        </div>
    );
};

export default AIChatAssistant;