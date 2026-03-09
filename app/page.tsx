import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-white">
            <h1 className="text-4xl font-bold mb-8">ASP.NET Core Architecture Chatbot</h1>
            <p className="text-xl text-slate-400 mb-12">
                Ask the AI assistant about Routing, Model Binding, and Validation in ASP.NET Core.
            </p>
            <div className="flex gap-4">
                <Link
                    href="https://ai-sdk.dev/docs/introduction"
                    target="_blank"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                    AI SDK Documentation
                </Link>
            </div>
        </main>
    );
}
