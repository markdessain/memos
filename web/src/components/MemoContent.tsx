import { useRef } from "react";
import { marked } from "@/labs/marked";
import "@/less/memo-content.less";
// @ts-ignore
import {exportToSvg} from "@excalidraw/utils"

interface Props {
  content: string;
  className?: string;
  onMemoContentClick?: (e: React.MouseEvent) => void;
  onMemoContentDoubleClick?: (e: React.MouseEvent) => void;
}

const MemoContent: React.FC<Props> = (props: Props) => {
  const { className, content, onMemoContentClick, onMemoContentDoubleClick } = props;
  const memoContentContainerRef = useRef<HTMLDivElement>(null);

  const text = useRef<HTMLDivElement>(document.createElement("div"))
  const svg = useRef<HTMLDivElement>(document.createElement("div"))

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    if (onMemoContentClick) {
      onMemoContentClick(e);
    }
  };

  const handleMemoContentDoubleClick = async (e: React.MouseEvent) => {
    if (onMemoContentDoubleClick) {
      onMemoContentDoubleClick(e);
    }
  };

  const run = async () => {
    for(var m of content.matchAll(/```[^]*?```/g)) {
      var found = m[0]
      var d = found.replaceAll("\n", "").replaceAll("```", "")

      if(d.startsWith('{"type":"excalidraw","version":2')) {
        const r = '<pre class="group"><button class="text-xs font-mono italic absolute top-0 right-0 px-2 leading-6 border btn-text rounded opacity-0 group-hover:opacity-60">copy</button><code class="language-plaintext">' + found.slice(4, -4) + '\n</code></pre>' 
        console.log(r)
        console.log(text.current.innerHTML)
        text.current.innerHTML = text.current.innerHTML.replace(r, "")

        let a = await exportToSvg(JSON.parse(d));
        a.style.height = 200
        a.style.width = "100%"
      
        svg.current.innerHTML = ""
        svg.current.appendChild(a)
      } 
    }
  }

  run()

  return (
    <div className={`memo-content-wrapper ${className || ""}`}>
      <div
        ref={memoContentContainerRef}
        className="memo-content-text"
        onClick={handleMemoContentClick}
        onDoubleClick={handleMemoContentDoubleClick}
      >
        <div ref={svg}/>
        <div ref={text}>
          {marked(content)}
        </div>
      </div>
    </div>
  );
};

export default MemoContent;
