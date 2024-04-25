import WikiForm from "./wiki/wiki-form";
import DrawGraph from "./wiki/draw-graph";
type MapItem = {
  [key: string]: string[];
};

const mapData: MapItem[] = [
  {
    "https://en.wikipedia.org/wiki/Arabia": [
      "https://en.wikipedia.org/wiki/Ostrich",
    ],
  },
  {
    "https://en.wikipedia.org/wiki/Arabian_Peninsula": [
      "https://en.wikipedia.org/wiki/Ostrich",
    ],
  },
  {
    "https://en.wikipedia.org/wiki/Camel": [
      "https://en.wikipedia.org/wiki/Ostrich_leather",
      "https://en.wikipedia.org/wiki/Sub-Saharan_Africa",
      "https://en.wikipedia.org/wiki/Arabian_Peninsula",
      "https://en.wikipedia.org/wiki/Pliocene",
      "https://en.wikipedia.org/wiki/Sahel",
      "https://en.wikipedia.org/wiki/Arabia",
    ],
  },
  { "https://en.wikipedia.org/wiki/Ostrich": [] },
  {
    "https://en.wikipedia.org/wiki/Ostrich_leather": [
      "https://en.wikipedia.org/wiki/Ostrich",
    ],
  },
  {
    "https://en.wikipedia.org/wiki/Pliocene": [
      "https://en.wikipedia.org/wiki/Ostrich",
    ],
  },
  {
    "https://en.wikipedia.org/wiki/Sahel": [
      "https://en.wikipedia.org/wiki/Ostrich",
    ],
  },
  {
    "https://en.wikipedia.org/wiki/Sub-Saharan_Africa": [
      "https://en.wikipedia.org/wiki/Ostrich",
    ],
  },
];

const startPage = "https://en.wikipedia.org/wiki/Camel";
const targetPage = "https://en.wikipedia.org/wiki/Ostrich";

export default function Home() {
  return (
    <main className="ml-20">
      <div className="items-center">
        { <DrawGraph
          mapData={mapData}
          startPage={startPage}
          targetPage={targetPage}
          showGraph={false}
        />}
        <WikiForm/>
      </div>
    </main>
  );
}
