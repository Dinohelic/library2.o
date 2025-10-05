import React from 'react';

const FirebaseConfigWarning: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-[100] flex items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold text-red-500 mb-4">Firebase Configuration Error</h1>
        <p className="text-lg text-slate-300 mb-6">
          The application cannot connect to Firebase because the configuration is missing or incorrect.
          This is expected on a new setup.
        </p>
        <div className="bg-slate-800 p-6 rounded-lg text-left">
          <h2 className="text-2xl font-bold text-brand-orange mb-4">How to Fix This:</h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-300">
            <li>
              Open the file <code className="bg-slate-700 text-yellow-300 px-2 py-1 rounded">services/firebase.ts</code> in your editor.
            </li>
            <li>
              Follow the instructions in the comments to replace the placeholder values (like <code className="bg-slate-700 text-yellow-300 px-2 py-1 rounded">"YOUR_API_KEY"</code>) with your actual Firebase project credentials.
            </li>
            <li>
              You can find your credentials in your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Firebase Project Settings</a>.
            </li>
            <li>
              Once you've added your credentials, save the file. The application should reload automatically.
            </li>
          </ol>
        </div>
        <p className="mt-8 text-sm text-slate-500">
          This warning will disappear once the configuration is valid.
        </p>
      </div>
    </div>
  );
};

export default FirebaseConfigWarning;
