import { useEffect, useState } from "react"

export default function Home({ textDict, source } ) {

/*
  const [ backendData, setBackendData ] = useState([{}])

  useEffect(() => {
     fetch("api").then((res) => res.json()).then(data => console.log("data", data))
  }, [])
*/
  const [isReady, setIsReady] = useState(false)
  const [chosenWord, setChosenWord] = useState('not initialized')
  const [currPhrase, setCurrPhrase] = useState('none')
  const [tempValue, setTempValue] = useState('')

  useEffect(() => {
    const data = JSON.parse(textDict)
    const keys = Object.keys(data)
    let currWord =  keys[Math.floor(Math.random() * 700)]
    while(currWord.length <= 2) {
      currWord = keys[Math.floor(Math.random() * 700)]
    }
    const sourceText = JSON.parse(source);
    setChosenWord(currWord)
    setCurrPhrase(sourceText[data[currWord][0]])
  }, [])

  useEffect(() => {
    const data = JSON.parse(textDict)
    const sourceText = JSON.parse(source);
    const hasKey = chosenWord in data
    if (hasKey) {
      setCurrPhrase(sourceText[data[chosenWord][0]])
    }
  }, [chosenWord])


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

  const handleSubmit = (e) => {
    e.preventDefault();
    setChosenWord(tempValue);
    setTempValue("");
  }

  const words = currPhrase.split(' ');

  const dynamicText = words.map((word, index) => {
        const isHighlighted = word === chosenWord;
        console.log("word", word)
        console.log("chosenWord", chosenWord)
        return (
          <span key={index} className={isHighlighted ? 'highlighted' : ''}>
            {word + " "}
          </span>
        );
      })

  if (isReady) {
    return (
      <main className="flex min-h-screen flex-col items-center">
        <div className="wrapper">
          <h2>{dynamicText}</h2>
          <form onSubmit={handleSubmit}>
            <input value={tempValue} type="text" onChange={handleChange} className="prompt-word-input"/>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="wrapper">
        <h2>Chosen word is {chosenWord}!</h2>
        <h2>{currPhrase}</h2>
        <span>Move between passages by typing a word you see on the screen and press enter or pave your own path...</span>
        <span>Press any key to start once it is done loading</span>
        <span>interactive non-linear text explorer that lets you travel static in a uniquely-disconnected path. By providing connections
          between different passages (from even different works) based on keywords and randomness, leading to new narratives and interpretations from the original linear stories
        </span>
        <span>inspired by exploration into experiencing literature in new ways</span>
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
