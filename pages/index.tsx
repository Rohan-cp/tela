import { useEffect, useState } from "react";
import useSound from 'use-sound';
import AnimatedSpecialText from "@/src/components/AnimatedSpecialText";

export default function Home({ lookupWord, source1, source2 } ) {

  const [play] = useSound('/sample.mp3')
  const [isReady, setIsReady] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)
  const [chosenWord, setChosenWord] = useState('not initialized')
  const [chosenWordCounter, setChosenWordCounter] = useState(0)
  const [currPhrase, setCurrPhrase] = useState([''])
  const [tempValue, setTempValue] = useState('')


  useEffect(() => {
    const data = JSON.parse(lookupWord)
    const keys = Object.keys(data)
    let currWord =  keys[Math.floor(Math.random() * 1000)]
    while (currWord.length <= 2) {
      currWord = keys[Math.floor(Math.random() * 1000)]
    }
    const sourceText1 = JSON.parse(source1);
    const sourceText2 = JSON.parse(source2);
    setChosenWord(currWord);

    const firstTextValue = data[currWord]
    const n = firstTextValue[0].length
    const m = firstTextValue[1].length
    let words = []
    if (n === 0) {
      words = sourceText2[firstTextValue[1][0]].split(" ")
    } else {
      words = sourceText1[firstTextValue[0][0]].split(" ")
    }
    words = words.join(" ").replace(/\n/g, " ").split(" ");
    setCurrPhrase(words);
  }, [])


  useEffect(() => {
    function handleKeyDown(e) {
      setIsReady(true)
    }

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleChange = (e) => {
    setTempValue(e.target.value)
  }

  useEffect(() => {
    const data = JSON.parse(lookupWord);
    const sourceText1 = JSON.parse(source1);
    const sourceText2 = JSON.parse(source2);

    const hasKey = chosenWord in data;
    if (hasKey) {
      const firstTextValue = data[chosenWord]
      const n2 = firstTextValue[0].length
      const m2 = firstTextValue[1].length
      let newIdx = 0;
      if (n2 !== 0 && m2 !== 0) {
        newIdx = Math.round(Math.random())
      } else if (m2 !== 0) {
        newIdx = 1
      } else {
        newIdx = 0
      }
      const desiredSentenceIdxs = data[chosenWord][newIdx];
      const n = desiredSentenceIdxs.length;
      const randomNewIdx = Math.floor(Math.random() * n);
      let words: String[];
      if (newIdx === 0) {
        words = sourceText1[desiredSentenceIdxs[randomNewIdx]].split(' ');
      } else {
        words = sourceText2[desiredSentenceIdxs[randomNewIdx]].split(' ');
      }
      setShowHighlight(true)
      setTimeout(() => {
        // console.log("chosenWord", chosenWord)
        setShowHighlight(false)
        words = words.join(" ").replace(/\n/g, " ").split(" ");
        setCurrPhrase(words);
      }, 2000);
    }
  }, [chosenWord, chosenWordCounter])

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log("chosenWord start", chosenWord)
    play()
console.log("should play before")
    setChosenWord(tempValue);
    setChosenWordCounter(currCounter => currCounter + 1)
    // console.log("tempValue submitted", tempValue)
    // console.log("chosenWord after update", chosenWord)
    setTempValue("");
  }

  var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

  const [show, setShow] = useState([""])

  useEffect(() => {
    setShow(currPhrase.map((word) => {
      const isHighlighted = word.replace(regex, '') === chosenWord;
      return isHighlighted && showHighlight ? 'highlighted' : 'usual'
   })
    )
  }, [showHighlight])

  const dynamicText = currPhrase.map((word, index) => {
      return (
        <span key={index} className={show[index]}>
          {word + " "}
         </span>
      );
  })

  console.log("currPhrase", currPhrase)
  if (isReady) {
    return (
      <main className="flex min-h-screen flex-col">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div className="experience-wrapper">
        <AnimatedSpecialText show={show} text={currPhrase} />
          <form onSubmit={handleSubmit}>
            <input value={tempValue} type="text" onChange={handleChange} className="prompt-word-input" />
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      <div className="wrapper">
        <span className="title">TELA</span>
        <span>Move between passages by typing a word you see on the screen and hit enter or pave your own path.</span>
        <span>Tela is an interactive non-linear text explorer that lets you travel static text in a uniquely-disconnected path. By providing connections
          between different passages (from even different works) based on keywords and randomness, leading to new narratives and interpretations from the original linear stories.
        </span>
        <span>Inspired by my exploration into experiencing literature in new ways.</span>
        <span>This experience includes the following texts:</span>
        <ul>
          <li>The Master and Margarita by Mikhail Bulgakov</li>
          <li>Oedipus the King by Sophocles</li>
          <li>Short Stories by H.P Lovecraft</li>
          <li>The Trial by Franz Kafka</li>
          <li>The Castle by Franz Kafka</li>
        </ul>
      </div>
    </main>
  )
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const lookup = await import('../data/lookup.json');
  const sourceText = await import('../data/trial_text.json');
  const sourceText2 = await import('../data/kafka_shore_text.json');
//  console.log("data and type:", textData["devotion"], typeof textData["devotion"]);
  const lookupWord = JSON.stringify(lookup);
  const source1 = JSON.stringify(sourceText);
  const source2 = JSON.stringify(sourceText2);

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      lookupWord,
      source1,
      source2
    },
  }
}
