// File: AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Định nghĩa loại gói dịch vụ
type PlanType = 'EXPLORER' | 'ARCHIVE' | 'MAGISTRATE' | 'TOANTRI';

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    userId: string | null;
    userEmail: string | null;
    plan: PlanType | null;
}

interface AuthContextType extends AuthState {
    login: (token: string, plan: PlanType, email: string) => void;
    logout: () => void;
    // Chức năng tạm thời để hiển thị thông báo thành công
    setSuccessMessage: (message: string) => void; 
    successMessage: string | null;
}

const defaultAuthState: AuthState = {
    isLoggedIn: false,
    token: null,
    userId: null,
    userEmail: null,
    plan: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Tải trạng thái ban đầu từ localStorage (nếu có)
    const [state, setState] = useState<AuthState>(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('seenyt_token');
            const storedPlan = localStorage.getItem('seenyt_plan') as PlanType | null;
            const storedEmail = localStorage.getItem('seenyt_email');
            
            if (storedToken && storedPlan && storedEmail) {
                return {
                    isLoggedIn: true,
                    token: storedToken,
                    userId: 'mock-id-001', // ID giả định cho mock user
                    userEmail: storedEmail,
                    plan: storedPlan,
                };
            }
        }
        return defaultAuthState;
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const login = (token: string, plan: PlanType, email: string) => {
        localStorage.setItem('seenyt_token', token);
        localStorage.setItem('seenyt_plan', plan);
        localStorage.setItem('seenyt_email', email);

        setState({
            isLoggedIn: true,
            token,
            userId: 'mock-id-001',
            userEmail: email,
            plan,
        });
        setSuccessMessage('Đăng nhập thành công!'); // Kích hoạt thông báo
        setTimeout(() => setSuccessMessage(null), 3000); // Tự động xóa sau 3s
    };

    const logout = () => {
        localStorage.removeItem('seenyt_token');
        localStorage.removeItem('seenyt_plan');
        localStorage.removeItem('seenyt_email');
        setState(defaultAuthState);
        setSuccessMessage('Đã đăng xuất thành công!');
        setTimeout(() => setSuccessMessage(null), 3000);
    };
    
    // Gán hàm setter vào context
    const contextValue: AuthContextType = {
        ...state,
        login,
        logout,
        setSuccessMessage,
        successMessage,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};