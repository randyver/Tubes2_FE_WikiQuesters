"use client";

import { useState } from "react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import Image from "next/image";

export default function Home() {
  const [startPage, setStartPage] = useState("");
  const [targetPage, setTargetPage] = useState("");
  const [startPageSuggestions, setStartPageSuggestions] = useState([]);
  const [targetPageSuggestions, setTargetPageSuggestions] = useState([]);

  // Function to handle suggestion selection for start page
  const handleStartSuggestionClick = (suggestion: string) => {
    setStartPage(suggestion);
    setStartPageSuggestions([]);
  };

  // Function to handle suggestion selection for target page
  const handleTargetSuggestionClick = (suggestion: string) => {
    setTargetPage(suggestion);
    setTargetPageSuggestions([]);
  };

  // Fetch suggestions from Wikipedia API for start page
  const fetchStartPageSuggestions = async (searchTerm: string) => {
    if (searchTerm.length > 0) {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(
          searchTerm
        )}&origin=*`
      );
      const data = await response.json();
      setStartPageSuggestions(data[1]);
    } else {
      setStartPageSuggestions([]);
    }
  };

  // Fetch suggestions from Wikipedia API for target page
  const fetchTargetPageSuggestions = async (searchTerm: string) => {
    if (searchTerm.length > 0) {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(
          searchTerm
        )}&origin=*`
      );
      const data = await response.json();
      setTargetPageSuggestions(data[1]);
    } else {
      setTargetPageSuggestions([]);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen my-10">
      {/* kotak yg ditaro tengah */}
      <div className="px-8">
        <div className="flex flex-row">
          <div className="relative">
            <Image
              className="absolute w-4/5 -z-10"
              src="/wikipedia.png"
              width={512}
              height={512}
              alt="wikipedia"
            />
            <Image
              className="w-3/5 ml-12"
              src="/finish.png"
              width={512}
              height={512}
              alt="finish"
            />
          </div>
          <div>
            <p className="text-4xl text-[#DBE2EF] mb-4">WikiQuesters</p>
            <p className="text-[#F9F7F7]">
              Solving WikiRace with IDS and BFS Algorithm
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-8 mt-10 text-[#F9F7F7]">
          <div className="flex flex-col relative">
            <h2 className="mb-2">Fill in the box with the start page.</h2>
            <Input
              type="text"
              placeholder="Start page"
              value={startPage}
              onChange={(e) => {
                setStartPage(e.target.value);
                fetchStartPageSuggestions(e.target.value);
              }}
            />
            <ul
              className={`${
                startPageSuggestions.length > 0
                  ? "bg-white p-2 rounded-md shadow-md"
                  : ""
              } absolute z-10 text-black w-full mt-16`}
            >
              {startPageSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleStartSuggestionClick(suggestion)}
                  className="cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col relative">
            <h2 className="mb-2">Fill in the box with the target page.</h2>
            <Input
              className=""
              type="text"
              placeholder="Target page"
              value={targetPage}
              onChange={(e) => {
                setTargetPage(e.target.value);
                fetchTargetPageSuggestions(e.target.value);
              }}
            />
            <ul
              className={`${
                targetPageSuggestions.length > 0
                  ? "bg-white p-2 rounded-md shadow-md"
                  : ""
              } absolute z-10 text-black w-full mt-16`}
            >
              {targetPageSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleTargetSuggestionClick(suggestion)}
                  className="cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Algorithm" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="light" className="cursor-pointer">
                BFS
              </SelectItem>
              <SelectItem value="dark" className="cursor-pointer">
                IDS
              </SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full">Find!</Button>
        </div>
      </div>
    </main>
  );
}
