"use client";

export function Header() {
  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    const result = await response.json();
    if (result.success) {
      // Redirect to login page or update UI to show logged out state
      window.location.href = "/login";
    }
  };

  return (
    <header className="bg-[#171717] shadow-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0 animate-fade-in" >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">
            Student Engagement System
          </h1>
          <p className="text-md sm:text-lg text-gray-400 max-w-2xl">
            Get a personalized 12-week roadmap for your engineering career
            journey
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-5 py-2 rounded-lg hover:from-purple-800 hover:to-indigo-800 transition-all duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
