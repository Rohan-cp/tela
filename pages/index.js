import { useEffect, useState } from "react";
import useSound from "use-sound";
import AnimatedSpecialText from "../src/components/AnimatedSpecialText";

export default function Home({
  lookupWord,
  source_kafka,
  source_master,
  source_lovecraft1,
  source_lovecraft2,
}) {
  const [play] = useSound("/typewriter-one-hit.mp3");
  const [isReady, setIsReady] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [chosenWord, setChosenWord] = useState("not initialized");
  const [chosenWordCounter, setChosenWordCounter] = useState(0);
  const [currPhrase, setCurrPhrase] = useState([""]);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const data = JSON.parse(lookupWord);
    const keys = Object.keys(data);
    let currWord = keys[Math.floor(Math.random() * 5000)];
    while (currWord.length <= 2) {
      currWord = keys[Math.floor(Math.random() * 5000)];
    }
    const sourceKafka = JSON.parse(source_kafka);
    const sourceMaster = JSON.parse(source_master);
    const sourceLovecraft1 = JSON.parse(source_lovecraft1);
    const sourceLovecraft2 = JSON.parse(source_lovecraft2);
    const sourceCollection = [
      sourceKafka,
      sourceMaster,
      sourceLovecraft1,
      sourceLovecraft2,
    ];
    const firstTextValue = data[currWord];
    const instancesLength = firstTextValue.map((arr) => arr.length || 0);

    const positiveInstanceIndicatorArr = instancesLength
      .map((n, index) => {
        if (n !== 0) {
          return index;
        } else {
          return -1;
        }
      })
      .filter((a) => a !== -1);

    // remove hp2 for now
    const n = positiveInstanceIndicatorArr.length - 1;
    const randomNewIdx = Math.floor(Math.random() * n);
    const nextSourceLookupIdx = positiveInstanceIndicatorArr[randomNewIdx];
    const sentenceIdxs = firstTextValue[nextSourceLookupIdx];

    const sourceLookup = sourceCollection[nextSourceLookupIdx];
    const cleanSentence = sourceLookup[sentenceIdxs[0]].replace(/\n/g, " ");
    const cleanWords = cleanSentence.split(" ");
    setCurrPhrase(cleanWords);
  }, [
    lookupWord,
    source_kafka,
    source_master,
    source_lovecraft1,
    source_lovecraft2,
  ]);

  useEffect(() => {
    function handleKeyDown(e) {
      setIsReady(true);
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChange = (e) => {
    setTempValue(e.target.value);
  };

  useEffect(() => {
    const data = JSON.parse(lookupWord);
    const sourceKafka = JSON.parse(source_kafka);
    const sourceMaster = JSON.parse(source_master);
    const sourceLovecraft1 = JSON.parse(source_lovecraft1);
    const sourceLovecraft2 = JSON.parse(source_lovecraft2);
    const sourceCollection = [
      sourceKafka,
      sourceMaster,
      sourceLovecraft1,
      sourceLovecraft2,
    ];

    const hasKey = chosenWord in data;
    if (hasKey) {
      const firstTextValue = data[chosenWord];
      const instancesLength = firstTextValue.map((arr) => arr.length || 0);
      const positiveInstanceIndicatorArr = instancesLength
        .map((n, index) => {
          if (n !== 0) {
            return index;
          } else {
            return -1;
          }
        })
        .filter((a) => a !== -1);

      const n = positiveInstanceIndicatorArr.length;
      const randomNewIdx = Math.floor(Math.random() * n);
      const nextSourceLookupIdx = positiveInstanceIndicatorArr[randomNewIdx];
      const sentenceIdxs = firstTextValue[nextSourceLookupIdx];
      const m = sentenceIdxs.length;
      const randomSentenceIdx = Math.floor(Math.random() * m);
      const sourceLookup = sourceCollection[nextSourceLookupIdx];

      const selectedSentenceIdx = sentenceIdxs[randomSentenceIdx];
      let words = sourceLookup[selectedSentenceIdx].split(" ");
      if (words.length < 25) {
        words = words.concat(sourceLookup[selectedSentenceIdx + 1]);
      }
      console.log("words after", words);
      setShowHighlight(true);
      setTimeout(() => {
        // console.log("chosenWord", chosenWord)
        setShowHighlight(false);
        words = words.join(" ").replace(/\n/g, " ").split(" ");
        setCurrPhrase(words);
      }, 2000);
    }
  }, [
    chosenWord,
    chosenWordCounter,
    lookupWord,
    source_kafka,
    source_master,
    source_lovecraft1,
    source_lovecraft2,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    play();
    setChosenWord(tempValue);
    setChosenWordCounter((currCounter) => currCounter + 1);
    setTempValue("");
  };

  // console.log("currPhrase", currPhrase)
  if (isReady) {
    return (
      <main className="flex min-h-screen flex-col">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div className="experience-wrapper">
          <AnimatedSpecialText
            text={currPhrase}
            chosenWord={chosenWord}
            showHighlight={showHighlight}
          />
          <form onSubmit={handleSubmit}>
            <input
              value={tempValue}
              type="text"
              onChange={handleChange}
              className="prompt-word-input"
            />
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="wrapper">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="title">TELA</span>
          <span className="subtitle">by rohan prashanth</span>
        </div>
        <span>
          Move between passages by typing a word you see on the screen and hit
          enter or pave your own path.
        </span>
        <span>Hit any key to start.</span>
        <span>
          Tela is an interactive non-linear text explorer that lets you travel
          static text in a uniquely-disconnected path. By providing connections
          between different passages (from even different works) based on
          keywords and randomness, new narratives and interpretations from the
          original linear stories may emerge.
        </span>
        <span>
          Inspired by my exploration into experiencing literature in new ways.
        </span>
        <div>
          <span>This experience includes the following texts:</span>
          <ul>
            <li>The Master & Margarita by Mikhail Bulgakov</li>
            <li>Kafka on the Shore by Haruki Murakami</li>
            <li>Selected Short Stories by H.P. Lovecraft</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const lookup = await import("../data/lookup.json");
  const source_kafka_json = await import("../data/kafka-shore.json");
  const source_master_json = await import("../data/master.json");
  const source_lovecraft1_json = await import("../data/lovecraft1.json");
  const source_lovecraft2_json = await import("../data/lovecraft2.json");

  const source_kafka = JSON.stringify(source_kafka_json);
  const source_master = JSON.stringify(source_master_json);
  const source_lovecraft1 = JSON.stringify(source_lovecraft1_json);
  const source_lovecraft2 = JSON.stringify(source_lovecraft2_json);

  const lookupWord = JSON.stringify(lookup);

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      lookupWord,
      source_kafka,
      source_master,
      source_lovecraft1,
      source_lovecraft2,
    },
  };
}
