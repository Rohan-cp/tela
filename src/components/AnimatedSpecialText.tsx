import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedSpecialText = ({ text, chosenWord, showHighlight }) => {
  const words=text.join(" ").replace(/\n/g, " ").split(" ").filter(word => word !== "");
  const [show, setShow] = useState([""])

  useEffect(() => {
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    setShow(words.map((word) => {
      const isHighlighted = word.replace(regex, '') === chosenWord;
      return isHighlighted && showHighlight ? 'highlighted' : 'usual'
   })
    )
  }, [showHighlight, chosenWord])

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", fontSize: "1.3rem", flexWrap: "wrap" }}
    >
      {words.map((word, index) => (
        <motion.span
          style={{ marginRight: "5px" }}
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1 + (index / 10),
            delay: 0,
          }}
          className={show[index]}
        >
          {word.trim()}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default AnimatedSpecialText;
