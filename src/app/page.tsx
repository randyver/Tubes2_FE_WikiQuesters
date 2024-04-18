"use client"

import { useState } from 'react';
import { Input } from '../components/ui/input';

export default function Home() {
  const [startPageSuggestions, setStartPageSuggestions] = useState([]);
  const [targetPageSuggestions, setTargetPageSuggestions] = useState([]);

  // Fungsi untuk mengambil saran dari API Wikipedia untuk start page
  const fetchStartPageSuggestions = async (searchTerm: string) => {
    if (searchTerm.length > 0) {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(searchTerm)}&origin=*`
      );
      const data = await response.json();
      setStartPageSuggestions(data[1]);
    } else {
      setStartPageSuggestions([]);
    }
  };

  // Fungsi untuk mengambil saran dari API Wikipedia untuk target page
  const fetchTargetPageSuggestions = async (searchTerm: string) => {
    if (searchTerm.length > 0) {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(searchTerm)}&origin=*`
      );
      const data = await response.json();
      setTargetPageSuggestions(data[1]);
    } else {
      setTargetPageSuggestions([]);
    }
  };

  return (
    <main className="flex flex-row">
      <div className="flex flex-col">
        <Input
          type="text"
          placeholder="start page"
          onChange={(e) => fetchStartPageSuggestions(e.target.value)}
        />
        <ul>
          {startPageSuggestions.map((suggestion, index) => (
            <li key={index}>
              <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(suggestion)}`} target="_blank" rel="noopener noreferrer">
                {suggestion}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col">
        <Input
          type="text"
          placeholder="target page"
          onChange={(e) => fetchTargetPageSuggestions(e.target.value)}
        />
        <ul>
          {targetPageSuggestions.map((suggestion, index) => (
            <li key={index}>
              <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(suggestion)}`} target="_blank" rel="noopener noreferrer">
                {suggestion}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
