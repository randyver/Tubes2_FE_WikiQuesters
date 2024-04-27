"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { z } from "zod";
import { MapItem } from "./draw-graph";
import DrawGraph from "./draw-graph";
import NetworkGraph from "./network-graph";

// Define schema using Zod
const formSchema = z.object({
  startPage: z.string().nonempty(),
  targetPage: z.string().nonempty(),
  algorithm: z.string().nonempty(),
});

// Define a custom event type that has a 'detail' property
interface CustomEvent<T> extends Event {
  detail: T;
}

let MapData: MapItem[] = [];

export default function WikiForm() {
  const [startPage, setStartPage] = useState("");
  const [targetPage, setTargetPage] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [startPageSuggestions, setStartPageSuggestions] = useState([]);
  const [targetPageSuggestions, setTargetPageSuggestions] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [pathLength, setPathLength] = useState(null);
  const [visitedCount, setVisitedCount] = useState(null);

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

  // Function to handle algorithm selection
  const handleAlgorithmSelect = (value: string) => {
    setAlgorithm(value);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form data
      setShowGraph(false);
      setLoading(true);
      const formData = formSchema.parse({
        startPage,
        targetPage,
        algorithm,
      });

      // Send formData to backend
      console.log("Form submitted:", formData);
      const response = await fetch("http://localhost:8080/api/submit", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      console.log(data.paths);
      const parsedData: any = JSON.parse(data.paths);
      MapData = parsedData as MapItem[];
      setExecutionTime(data.time);
      setPathLength(data.path_length);
      setVisitedCount(data.visitedCount);
      setShowGraph(true);
      console.log(MapData);
      console.log(data.execution_time);
      console.log(data.path_length);
      console.log(data.visited_count);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
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
    <main className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center h-screen my-10">
        <div className="px-8 md:px-12">
          <div className="flex flex-row">
            <div className="relative mt-4 md:mb-10 md:mr-8">
              <Image
                className="absolute w-4/5 -z-10 md:w-48"
                src="/wikipedia.png"
                width={512}
                height={512}
                alt="wikipedia"
              />
              <Image
                className="w-3/5 ml-12 md:w-32 md:ml-24"
                src="/finish.png"
                width={512}
                height={512}
                alt="finish"
              />
            </div>
            <div>
              <p className="text-4xl text-[#112D4E] mb-4 font-bold md:text-6xl font-mono">
                WikiQuesters
              </p>
              <p className="text-[#112D4E] md:text-2xl">
                Solving WikiRace with IDS and BFS Algorithm
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-8 mt-10 text-[#112D4E] md:text-lg">
            <div className="flex flex-col relative">
              <h2 className="mb-2">Fill in the box with the start page.</h2>
              <Input
                className="md:text-lg"
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
                className="md:text-lg"
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
            <Select onValueChange={(value) => handleAlgorithmSelect(value)}>
              <SelectTrigger className="w-full md:text-lg border-[#112D4E]">
                <SelectValue placeholder="Algorithm" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="BFS" className="cursor-pointer">
                  BFS
                </SelectItem>
                <SelectItem value="IDS" className="cursor-pointer">
                  IDS
                </SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full md:text-lg" onClick={handleSubmit}>
              {loading ? "Loading..." : "Find!"}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mb-20">
        {showGraph && (
          <p className="mb-10 text-3xl font-bold font-mono text-[#112D4E]">Here is the result!</p>
        )}
        <NetworkGraph
          mapData={MapData}
          startPage={startPage}
          targetPage={targetPage}
          showGraph={showGraph}
        />
        {showGraph && (
          <div className="flex gap-x-40 font-mono text-[#112D4E] md:text-lg mt-10">
            <p>Execution Time: {executionTime} ms</p>
            <p>Visited Count: {visitedCount}</p>
            <p>Path Length: {pathLength}</p>
          </div>
        )}
      </div>
    </main>
  );
}
