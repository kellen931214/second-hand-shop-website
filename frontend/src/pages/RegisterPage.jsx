import React, { useState } from "react";
import { register } from "../api/authApi";

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (pwd) => {
        if (pwd.length < 8) return "密碼長度至少需要 8 個字元";
        if (!/[a-z]/.test(pwd)) return "密碼必須包含至少一個小寫字母";
        if (!/[A-Z]/.test(pwd)) return "密碼必須包含至少一個大寫字母";
        if (!/[0-9]/.test(pwd)) return "密碼必須包含至少一個數字";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "密碼必須包含至少一個特殊符號";
        return ""; 
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        
        if (newPassword.length > 0) {
            setPasswordError(validatePassword(newPassword));
        } else {
            setPasswordError('');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const currentPasswordError = validatePassword(password);
        if (currentPasswordError !== "") {
            setPasswordError(currentPasswordError);
            return; 
        }

        if (password !== passwordConfirmation) {
            setErrorMessage('兩次輸入的密碼不一致！');
            return; 
        }

        try {
            const response = await register({ 
                name, 
                email, 
                password, 
                password_confirmation: passwordConfirmation 
            });
            console.log("註冊成功！", response.data);
            window.location.href = "/";
        } catch (error) {
            setErrorMessage(error.response?.data?.message || '註冊失敗，請稍後再試');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <form onSubmit={handleRegister} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-5">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-2">歡迎註冊</h1>
                
                {errorMessage && (
                    <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 px-4 py-3 rounded-lg text-sm">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">姓名</label>
                    <input type="text" required onChange={(e) => setName(e.target.value)} placeholder="請輸入姓名" className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2.5 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">電子信箱</label>
                    <input type="email" required onChange={(e) => setEmail(e.target.value)} placeholder="請輸入信箱" className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2.5 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">密碼</label>
                    <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={handlePasswordChange} 
                        placeholder="至少 8 碼，包含大小寫、數字與符號" 
                        className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none ${
                            passwordError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
                        }`} 
                    />
                    {passwordError && (
                        <span className="text-xs font-medium text-red-500">{passwordError}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-600">確認密碼</label>
                    <input 
                        type="password" 
                        required 
                        value={passwordConfirmation}
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