import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingButton = ({ isLoading, onClick, disabled, loadingText, buttonText }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    <span>{loadingText || '处理中...'}</span>
                </div>
            ) : (
                <span>{buttonText}</span>
            )}
        </button>
    );
};

export default LoadingButton;