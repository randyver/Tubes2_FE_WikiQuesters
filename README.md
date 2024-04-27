# Tugas Besar 2 Strategi Algoritma 2024 | WikiQuesters

## Description

This repository contains the front-end code for the WikiQuesters website, which solves the WikiRace game using BFS and IDS algorithmic approaches.

## Features
1. Determine paths that are solutions to WikiRace
2. Display path visualization with a graph


## Algorithm Explained

### Breadth First Search (BFS)
The BFS algorithm is used to traverse or search a graph in a very systematic way. BFS starts traversal from the root, then traverses all nodes at the current level before moving to nodes at the next level. Each Wikipedia page is considered a node in the graph, and each link leading to another page is considered an edge. BFS starts from the initial page, then explores all pages that can be accessed directly through links on that page (i.e., all adjacent nodes). This process continues until the destination page is found or all pages have been explored.

### Iterative Depth Search (IDS)
IDS is a combined search strategy that combines the advantages of BFS and DFS (Depth-First Search). IDS first performs DFS up to a certain depth, then increases the depth after each iteration until the maximum depth is reached. IDS can be used to find the shortest path between two Wikipedia pages. IDS starts the search from the initial page and performs DFS up to a certain depth. If the destination page is not found, the search depth is increased. This process continues until the destination page is found or the maximum depth is reached.

## Tech Stack
1. Typescript
2. Tailwind CSS
3. Next JS

## Requirements

Here are the requirements needed to run the program:
* Node.js
* npm
  ```sh
  npm install npm@latest -g
  ``` 
  
## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/randyver/Tubes2_FE_WikiQuesters
   ```
2. Change directory to the root of the cloned local repository using
   ```sh
   cd Tubes2_FE_WikiQuesters/src
   ```
3. Run program using
   ```sh
   npm run dev
   ```
4. The results of the program can be opened at [http://localhost:3000](http://localhost:3000)

   
## Authors
| NIM      | Name                         |
|----------|------------------------------|
| 13522067 | Randy Verdian                |
| 13522099 | Abdul Rafi Radityo Hutomo    |
| 13522107 | Rayendra Althaf Taraka Noor  |
