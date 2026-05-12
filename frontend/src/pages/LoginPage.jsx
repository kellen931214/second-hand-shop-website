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
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
            
            <form onSubmit={handleLogin} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-5">
                
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-2">
                    歡迎登入
                </h1>
                
                {errorMessage && (
                    <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 px-4 py-3 rounded-lg text-sm text-center">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">電子信箱</label>
                    <input 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="請輸入信箱" 
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2.5 focus:outline-none focus:border-gray-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-gray-500 dark:focus:ring-indigo-500 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">密碼</label>
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="請輸入密碼" 
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2.5 focus:outline-none focus:border-gray-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-gray-500 dark:focus:ring-indigo-500 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="mt-4 w-full bg-gray-800 dark:bg-indigo-600 hover:bg-gray-900 dark:hover:bg-indigo-700 text-white font-semibold rounded-lg py-2.5 transition-colors shadow-sm"
                >
                    登入
                </button>
            </form>
        </div>
    );
};

export default LoginPage;