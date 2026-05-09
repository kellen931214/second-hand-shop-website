import React, { useState } from 'react';
import { csrf, login } from '../api/authApi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage , setErrorMessage] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        setErrorMessage(''); 

        try {
            await csrf();
            const response = await login({ email, password });
            
            console.log("登入成功！", response.data);
            window.location.href = "/";
        } catch (error) {
            console.error("登入失敗", error.response?.data?.message);
            setErrorMessage(error.response?.data?.message || '帳號不存在或密碼錯誤');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-5">
                
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    歡迎登入
                </h1>
                
                {errorMessage && (
                    <div className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg text-sm text-center">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">電子信箱</label>
                    <input 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="請輸入信箱" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">密碼</label>
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="請輸入密碼" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                    />
                </div>
                
                {/* 登入按鈕 */}
                <button 
                    type="submit" 
                    className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg py-2.5 transition-colors shadow-sm"
                >
                    登入
                </button>
            </form>
        </div>
    );
};

export default LoginPage;