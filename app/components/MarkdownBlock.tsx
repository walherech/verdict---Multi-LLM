'use client';

/**
 * Minimal markdown-style rendering: paragraphs, headers, bold, lists, code.
 * No external deps.
 */
export function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split('\n');
  const out: React.ReactNode[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeLines: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        out.push(
          <pre key={i} className="bg-[#0d0d0d] border border-[#2a2a2a] rounded p-4 overflow-x-auto text-sm font-mono text-gray-300 my-3">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
      }
      inCodeBlock = !inCodeBlock;
      i++;
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      i++;
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      out.push(<br key={i} />);
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      out.push(<h3 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{trimmed.slice(4)}</h3>);
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      out.push(<h2 key={i} className="text-xl font-semibold text-white mt-5 mb-2">{trimmed.slice(3)}</h2>);
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      out.push(<h1 key={i} className="text-2xl font-bold text-white mt-5 mb-2">{trimmed.slice(2)}</h1>);
      i++;
      continue;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bullet = trimmed.slice(2);
      out.push(<li key={i} className="ml-4 text-gray-300">{inlineFormat(bullet)}</li>);
      i++;
      continue;
    }
    out.push(<p key={i} className="text-gray-300 leading-relaxed mb-2">{inlineFormat(trimmed)}</p>);
    i++;
  }
  if (codeLines.length > 0) {
    out.push(
      <pre key="code-end" className="bg-[#0d0d0d] border border-[#2a2a2a] rounded p-4 overflow-x-auto text-sm font-mono text-gray-300 my-3">
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
  }
  return <div className="prose-invert max-w-none">{out}</div>;
}

function inlineFormat(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldStart = remaining.indexOf('**');
    const codeStart = remaining.indexOf('`');
    let next = -1;
    let type: 'bold' | 'code' | null = null;
    if (boldStart >= 0 && (codeStart < 0 || boldStart <= codeStart)) {
      next = boldStart;
      type = 'bold';
    }
    if (codeStart >= 0 && (next < 0 || codeStart < next)) {
      next = codeStart;
      type = 'code';
    }
    if (next < 0) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
    if (next > 0) parts.push(<span key={key++}>{remaining.slice(0, next)}</span>);
    remaining = remaining.slice(next);
    if (type === 'bold') {
      const end = remaining.slice(2).indexOf('**');
      if (end >= 0) {
        parts.push(<strong key={key++} className="text-white font-semibold">{remaining.slice(2, end + 2)}</strong>);
        remaining = remaining.slice(end + 4);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    } else {
      const end = remaining.slice(1).indexOf('`');
      if (end >= 0) {
        parts.push(<code key={key++} className="bg-[#0d0d0d] px-1.5 py-0.5 rounded text-amber-400 font-mono text-sm">{remaining.slice(1, end + 1)}</code>);
        remaining = remaining.slice(end + 2);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }
  }
  return <>{parts}</>;
}
