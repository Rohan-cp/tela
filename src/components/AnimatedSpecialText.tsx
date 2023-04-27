import { motion } from 'framer-motion';

const AnimatedSpecialText = ({ text, show }) => {
  const words=text.join(" ").replace(/\n/g, " ").split(" ");

  console.log("text", text);
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
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default AnimatedSpecialText;
