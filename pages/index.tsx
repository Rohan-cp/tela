import { useEffect, useState } from "react"

export default function Home({ textDict, source } ) {

  const [isReady, setIsReady] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)
  const [chosenWord, setChosenWord] = useState('not initialized')
  const [chosenWordCounter, setChosenWordCounter] = useState(0)
  const [currPhrase, setCurrPhrase] = useState(['none'])
  const [tempValue, setTempValue] = useState('')

  useEffect(() => {
    const data = JSON.parse(textDict)
    const keys = Object.keys(data)
    let currWord =  keys[Math.floor(Math.random() * 1000)]
    while (currWord.length <= 2) {
      currWord = keys[Math.floor(Math.random() * 1000)]
    }
    const sourceText = JSON.parse(source);
    setChosenWord(currWord);

    const words = sourceText[data[currWord][0]].split(" ");
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
    const data = JSON.parse(textDict);
    const sourceText = JSON.parse(source);
    const hasKey = chosenWord in data;
    if (hasKey) {
      const desiredSentenceIdxs = data[chosenWord];
      const n = desiredSentenceIdxs.length;
      const randomNewIdx = Math.floor(Math.random() * n);
      const words = sourceText[desiredSentenceIdxs[randomNewIdx]].split(' ');
      setShowHighlight(true)
      setTimeout(() => {
        // console.log("chosenWord", chosenWord)
        setShowHighlight(false)
        setCurrPhrase(words);
      }, 2000);
    }
  }, [chosenWord, chosenWordCounter])

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log("chosenWord start", chosenWord)
    setChosenWord(tempValue);
    setChosenWordCounter(currCounter => currCounter + 1)
    // console.log("tempValue submitted", tempValue)
    // console.log("chosenWord after update", chosenWord)
    setTempValue("");
  }

  var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

  const [show, setShow] = useState([""])

  useEffect(() => {
    setShow( currPhrase.map((word) => {
      const isHighlighted = word.replace(regex, '') === chosenWord;
      return isHighlighted && showHighlight ? 'highlighted' : ''
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

  if (isReady) {
    return (
      <main className="flex min-h-screen flex-col">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div className="experience-wrapper">
          <h2>{dynamicText}</h2>
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
        <h1>Tela</h1>
        <span>Move between passages by typing a word you see on the screen and press enter or pave your own path...</span>
        <span>Press any key to start once it is done loading</span>
        <span>Tela is an interactive non-linear text explorer that lets you travel static in a uniquely-disconnected path. By providing connections
          between different passages (from even different works) based on keywords and randomness, leading to new narratives and interpretations from the original linear stories
        </span>
        <span>Inspired by exploration into experiencing literature in new ways</span>
        <span>This experience includes the following texts</span>
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
  const textData = await import('../data/data.json');
  const sourceText = await import('../data/source_text.json');

//  console.log("data and type:", textData["devotion"], typeof textData["devotion"]);
  const textDict = JSON.stringify(textData);
  const source = JSON.stringify(sourceText);

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      textDict,
      source
    },
  }
}
