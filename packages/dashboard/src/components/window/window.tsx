import { motion } from 'framer-motion';

export default function Window({ id }: { id: string }) {
  return <motion.div layoutId={`window-${id}`}></motion.div>;
}
