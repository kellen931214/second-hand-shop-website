import React, { useState } from "react";
import { register } from "../api/authApi";

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // 1. 新增確認密碼的狀態
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            // 2. 傳送給後端的欄位名稱必須是 password_confirmation (Laravel 的慣例)
            const response = await register({ 
                name, 
                email, 
                password, 
                password_confirmation: passwordConfirmation 
            });
            console.log("註冊成功！", response.data);
            window.location.href = "/";
        } catch (error) {
            // 這裡會把後端傳回來的錯誤訊息顯示在畫面上
            setErrorMessage(error.response?.data?.message || '註冊失敗，請稍後再試');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-5">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">歡迎註冊</h1>
                
                {errorMessage && (
                    <div className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* 姓名欄位 */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">姓名</label>
                    <input type="text" required onChange={(e) => setName(e.target.value)} placeholder="請輸入姓名" className="w-full rounded-lg border border-gray-300 px-4 py-2.5" />
                </div>

                {/* 信箱欄位 */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">電子信箱</label>
                    <input type="email" required onChange={(e) => setEmail(e.target.value)} placeholder="請輸入信箱" className="w-full rounded-lg border border-gray-300 px-4 py-2.5" />
                </div>

                {/* 密碼欄位 */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">密碼</label>
                    <input type="password" required onChange={(e) => setPassword(e.target.value)} placeholder="請輸入密碼" className="w-full rounded-lg border border-gray-300 px-4 py-2.5" />
                </div>

                {/* 3. 新增確認密碼輸入框 */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">確認密碼</label>
                    <input 
                        type="password" 
                        required 
                        onChange={(e) => setPasswordConfirmation(e.target.value)} 
                        placeholder="請再次輸入密碼" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-gray-500"
                    />
                </div>

                <button type="submit" className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg py-2.5">
                    註冊
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;