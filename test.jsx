<div className="rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-200 p-4">
                    <div className="mb-4 flex items-center rounded-lg bg-gray-100 px-3 py-2">
                        <span className="material-symbols-outlined text-gray-500">search</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by merchant, item, or amount..."
                            className="ml-2 w-full bg-transparent border-none text-sm text-slate-900 placeholder-gray-500 focus:ring-0"
                        />
                    </div>

                    {/* then the buttons */}
                </div>

</div>